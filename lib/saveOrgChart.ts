'use server';

import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { Employee } from '../context/OrgChartContext';

export async function saveOrgChartToFile(orgChartData: Employee, filename: string = 'org-chart.json') {
  try {
    const filePath = join(process.cwd(), 'public', filename);
    await writeFile(filePath, JSON.stringify(orgChartData, null, 2));
    console.log(`Org chart saved to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('Error saving org chart:', error);
    throw error;
  }
}

export async function loadOrgChartFromFile(filename: string = 'org-chart.json'): Promise<Employee> {
  try {
    const filePath = join(process.cwd(), 'public', filename);
    const fileContents = await readFile(filePath, 'utf8');
    return JSON.parse(fileContents) as Employee;
  } catch (error) {
    console.error('Error loading org chart:', error);
    throw error;
  }
}
