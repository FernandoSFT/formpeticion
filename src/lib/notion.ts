import { Client } from '@notionhq/client';

export const notion = new Client({
    auth: process.env.NOTION_API_KEY || '',
});

export const CONTACTS_DB_ID = process.env.NOTION_DATABASE_CONTACTS_ID || '';
export const PETITIONS_DB_ID = process.env.NOTION_DATABASE_PETITIONS_ID || '';

// We keep a check but inside the query function or similar
function validateConfig() {
    if (!process.env.NOTION_API_KEY || !CONTACTS_DB_ID || !PETITIONS_DB_ID) {
        console.error('Environment variables for Notion are missing!');
        return false;
    }
    return true;
}

// Helper to query database using fetch workaround
export async function queryDatabase(databaseId: string, filter?: any) {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            filter: filter,
            page_size: 1
        })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || JSON.stringify(data));
    }
    return data;
}
