import { NextResponse } from 'next/server';
import { CONTACTS_DB_ID, PETITIONS_DB_ID } from '@/lib/notion';

export async function GET() {
    try {
        const fetchDB = async (id: string) => {
            const res = await fetch(`https://api.notion.com/v1/databases/${id}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ page_size: 1 })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || JSON.stringify(data));
            return data;
        }

        const contactsQuery = await fetchDB(CONTACTS_DB_ID).catch(e => ({ error: e.message }));
        const petitionsQuery = await fetchDB(PETITIONS_DB_ID).catch(e => ({ error: e.message }));

        const simplify = (props: any) => {
            if (!props) return 'No properties found';
            const simple: Record<string, any> = {};
            for (const key in props) {
                simple[key] = props[key].type;
            }
            return simple;
        };

        const contactProps = (contactsQuery as any).results?.[0]?.properties;
        const petitionProps = (petitionsQuery as any).results?.[0]?.properties;

        return NextResponse.json({
            contacts: contactProps ? simplify(contactProps) : contactsQuery,
            petitions: petitionProps ? simplify(petitionProps) : petitionsQuery
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || JSON.stringify(error) }, { status: 500 });
    }
}
