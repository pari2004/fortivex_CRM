import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'permissions.json');

function ensureDataFile() {
  if (!fs.existsSync(path.dirname(dataFile))) {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ userPermissions: {}, customRoles: [] }));
  }
}

export async function GET() {
  try {
    ensureDataFile();
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading permissions file:', error);
    return NextResponse.json({ userPermissions: {}, customRoles: [] });
  }
}

export async function POST(req: Request) {
  try {
    ensureDataFile();
    const body = await req.json();
    const current = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    
    if (body.userPermissions) {
      current.userPermissions = body.userPermissions;
    }
    if (body.customRoles) {
      current.customRoles = body.customRoles;
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(current, null, 2));
    return NextResponse.json({ success: true, data: current });
  } catch (error) {
    console.error('Error writing permissions file:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
