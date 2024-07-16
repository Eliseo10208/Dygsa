import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request): Promise<Response> {
    try {
        const data = await request.formData();
        const file = data.get('file') as File;

        if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = path.join('src', 'public', 'image.jpg');
        await writeFile(filePath, buffer);

        return new Response(JSON.stringify({ message: 'File uploaded successfully' }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
