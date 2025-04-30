import * as ExcelJS from 'exceljs';

export async function generateExcelBuffer(
  data: { usuario?: string; datos?: Record<string, any>[] }[],
  filename: string
): Promise<{ buffer: Buffer; filename: string }> {
  const workbook = new ExcelJS.Workbook();

  // Verificar si el formato es [{}] o [usuario:nombre, datos:[{},{}]]
  if (!data[0].datos) {
    console.log("aqui1")
    // Formato [{}], colocar todo en un único worksheet
    const worksheet = workbook.addWorksheet('Sheet 1');

    if (data.length === 0) {
      worksheet.addRow(["Registros no disponibles"]);
    } else {
      const keys = Object.keys(data[0]);

      worksheet.columns = keys.map((key, index) => ({
        key: key,
        width: index === 0 ? 20 : 30,
      }));

      const headerRow = worksheet.addRow(keys);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
      });

      for (const row of data) {
        const rowData = Object.values(row);
        worksheet.addRow(rowData);
      }
    }
  } else {
    console.log("aqui2")
    // Formato [usuario:nombre, datos:[{},{}]], aplicar multi-worksheet
    for (const sheetData of data) {
      const { usuario, datos } = sheetData;

      const worksheet = workbook.addWorksheet(usuario || 'Sheet 1');

      if (!datos || datos.length === 0) {
        worksheet.addRow(["Registros no disponibles"]);
        continue;
      }

      const keys = Object.keys(datos[0]);

      worksheet.columns = keys.map((key, index) => ({
        key: key,
        width: index === 0 ? 20 : 30,
      }));

      const headerRow = worksheet.addRow(keys);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
      });

      for (const row of datos) {
        const rowData = Object.values(row);
        worksheet.addRow(rowData);
      }
    }
  }

  // Generar el buffer del archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Devolver el buffer y el nombre del archivo
  return {
    buffer: buffer as Buffer,
    filename: `${filename}.xlsx`,
  };
}
