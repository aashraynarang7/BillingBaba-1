declare module 'xlsx' {
  export interface WorkSheet {
    [key: string]: any;
  }

  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [sheetName: string]: WorkSheet };
  }

  export interface XLSXUtils {
    json_to_sheet<T = any>(data: T[]): WorkSheet;
    book_new(): WorkBook;
    book_append_sheet(workbook: WorkBook, worksheet: WorkSheet, name: string): void;
    writeFile(workbook: WorkBook, filename: string): void;
    sheet_add_aoa(worksheet: WorkSheet, data: any[][], opts?: { origin?: string | number }): void;
  }

  export const utils: XLSXUtils;
}
