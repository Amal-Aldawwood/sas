import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Tenant, User } from '@prisma/client';

// Define paths for our JSON storage files
const DATA_DIR = path.join(process.cwd(), 'data');
const TENANTS_FILE = path.join(DATA_DIR, 'tenants.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`[STORAGE-API] Created data directory at ${DATA_DIR}`);
  } catch (error) {
    console.error('[STORAGE-API] Error creating data directory:', error);
  }
}

// Initialize files if they don't exist
function initFiles() {
  try {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log(`[STORAGE-API] Created data directory at ${DATA_DIR}`);
    }
    
    // Initialize tenants file if it doesn't exist
    if (!fs.existsSync(TENANTS_FILE)) {
      fs.writeFileSync(TENANTS_FILE, JSON.stringify([], null, 2));
      console.log(`[STORAGE-API] Initialized empty tenants file`);
    } else {
      // Validate existing file
      try {
        const data = fs.readFileSync(TENANTS_FILE, 'utf8');
        JSON.parse(data); // Just to verify it's valid JSON
        console.log(`[STORAGE-API] Verified existing tenants file is valid`);
      } catch (parseError) {
        console.error('[STORAGE-API] Tenants file contains invalid JSON, reinitializing:', parseError);
        fs.writeFileSync(TENANTS_FILE, JSON.stringify([], null, 2));
      }
    }

    // Initialize users file if it doesn't exist
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
      console.log(`[STORAGE-API] Initialized empty users file`);
    } else {
      // Validate existing file
      try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        JSON.parse(data); // Just to verify it's valid JSON
        console.log(`[STORAGE-API] Verified existing users file is valid`);
      } catch (parseError) {
        console.error('[STORAGE-API] Users file contains invalid JSON, reinitializing:', parseError);
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
      }
    }
  } catch (error) {
    console.error('[STORAGE-API] Error during file initialization:', error);
  }
}

// Initialize files on server start
initFiles();

// GET handler to load data
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get('type');
  
  if (type === 'tenants') {
    try {
      if (fs.existsSync(TENANTS_FILE)) {
        const data = fs.readFileSync(TENANTS_FILE, 'utf8');
        const tenants = JSON.parse(data);
        return NextResponse.json({ tenants });
      }
    } catch (error) {
      console.error('[STORAGE-API] Error loading tenants from storage:', error);
      return NextResponse.json({ error: 'Failed to load tenants' }, { status: 500 });
    }
  } else if (type === 'users') {
    try {
      if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        const users = JSON.parse(data);
        return NextResponse.json({ users });
      }
    } catch (error) {
      console.error('[STORAGE-API] Error loading users from storage:', error);
      return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
    }
  }
  
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

// POST handler to save data
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, data } = body;
  
  if (!type || !data) {
    return NextResponse.json({ error: 'Missing type or data' }, { status: 400 });
  }
  
  if (type === 'tenants') {
    try {
      // Make sure data directory exists
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      
      // First write to a temporary file to avoid corruption if process is interrupted
      const tempFile = `${TENANTS_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
      
      // Then rename the temporary file to the actual file (atomic operation)
      fs.renameSync(tempFile, TENANTS_FILE);
      
      console.log(`[STORAGE-API] Saved ${data.length} tenants to storage`);
      return NextResponse.json({ success: true, count: data.length });
    } catch (error) {
      console.error('[STORAGE-API] Error saving tenants to storage:', error);
      return NextResponse.json({ error: 'Failed to save tenants' }, { status: 500 });
    }
  } else if (type === 'users') {
    try {
      // Make sure data directory exists
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      
      // First write to a temporary file to avoid corruption if process is interrupted
      const tempFile = `${USERS_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
      
      // Then rename the temporary file to the actual file (atomic operation)
      fs.renameSync(tempFile, USERS_FILE);
      
      console.log(`[STORAGE-API] Saved ${data.length} users to storage`);
      return NextResponse.json({ success: true, count: data.length });
    } catch (error) {
      console.error('[STORAGE-API] Error saving users to storage:', error);
      return NextResponse.json({ error: 'Failed to save users' }, { status: 500 });
    }
  }
  
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

// PUT handler to save initial data (only if files don't exist yet)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { type, initialData } = body;
  
  if (!type || !initialData) {
    return NextResponse.json({ error: 'Missing type or initialData' }, { status: 400 });
  }
  
  if (type === 'tenants') {
    try {
      if (!fs.existsSync(TENANTS_FILE)) {
        fs.writeFileSync(TENANTS_FILE, JSON.stringify(initialData, null, 2));
        console.log(`[STORAGE-API] Initialized tenants storage with ${initialData.length} tenants`);
      }
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('[STORAGE-API] Error initializing tenants storage:', error);
      return NextResponse.json({ error: 'Failed to initialize tenants' }, { status: 500 });
    }
  } else if (type === 'users') {
    try {
      if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify(initialData, null, 2));
        console.log(`[STORAGE-API] Initialized users storage with ${initialData.length} users`);
      }
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('[STORAGE-API] Error initializing users storage:', error);
      return NextResponse.json({ error: 'Failed to initialize users' }, { status: 500 });
    }
  }
  
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
