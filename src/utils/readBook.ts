import { read } from "xlsx"

const readFile = (file: File) => {
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)

  return new Promise<string | ArrayBuffer | null>(resolve => {
    reader.onload = e => {
      resolve(e?.target?.result)
    }
  })
}

export const readBook = async (file: File) => {
  const buffer = await readFile(file)

  const workbook = read(buffer, {type: 'array'})
  return workbook
}
