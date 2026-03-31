import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonPath, value } = body;

    if (!jsonPath) {
      return NextResponse.json({ error: 'Missing jsonPath' }, { status: 400 });
    }

    const contentPath = path.join(process.cwd(), 'src', 'data', 'site-content.json');
    const contentData = await fs.readFile(contentPath, 'utf8');
    const content = JSON.parse(contentData);

    // Helper to set nested property
    const setNestedProperty = (obj: any, path: string, value: any) => {
      const parts = path.split('.');
      let current = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in current)) current[part] = {};
        current = current[part];
      }
      current[parts[parts.length - 1]] = value;
    };

    setNestedProperty(content, jsonPath, value);

    // Write back to file
    await fs.writeFile(contentPath, JSON.stringify(content, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
