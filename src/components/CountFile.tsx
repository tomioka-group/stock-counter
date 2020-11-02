import { FC, useRef, useState } from "react"
import { utils, WorkBook } from "xlsx"
import { readBook } from "../utils/readBook"
import { Card } from "./Card"

type Props = {
  countFile: CountFile | null
  setter: (cf: CountFile) => void
}

type Status = "default" | "selectSheet" | "loaded"

export const CountFile: FC<Props> = ({
  countFile,
  setter
}) => {
  const [status, setStatus] = useState<Status>("default")
  const inputRef = useRef<HTMLInputElement>(null)
  const [book, setBook] = useState<WorkBook | null>(null)


  const readCountFile =  async () => {
    if (inputRef.current?.files?.length) {
      const file = inputRef.current.files[0]
      const result = await readBook(file)
      setBook(result)
      setStatus("selectSheet")
    }
  }

  const selectSheet = (name: string) => () => {
    if (book) {
      const rows = utils.sheet_to_json<SheetRow>(book.Sheets[name], { header: 1 })
      setter({
        fileName: name,
        rows: rows,
      })
      setStatus("loaded")
    }
  }

  switch(status) {
    case "default":
      return (
        <Card>
          <input
            type="file"
            ref={inputRef}
            onChange={readCountFile}
          />
        </Card>
      )

    case "selectSheet":
      return (
        <Card>
          {book?.SheetNames.map((name, index) => (
            <div key={index}>
              <span>{name}</span>
              <button onClick={selectSheet(name)}>SELECT</button>
            </div>
          ))}
        </Card>
      )

    case "loaded":
      return (
        <Card>
          <h2>{countFile?.fileName}</h2>
          <p>SKU: {1001}</p>
          <p>総在庫数: {1010}</p>
        </Card>
      )
  }
}
