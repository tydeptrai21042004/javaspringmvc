import * as XLSX from 'xlsx';

export function importExcel(file, onData) {
  const reader = new FileReader();
  reader.onload = e => {
    const wb = XLSX.read(e.target.result, { type: 'binary' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws);
    onData(data);
  };
  reader.readAsBinaryString(file);
}

export function exportExcel(data, fileName = 'export.xlsx') {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  XLSX.writeFile(wb, fileName);
}
