import { FC, useRef } from "react"
import { utils } from "xlsx"
import { readBook } from "../utils/readBook"
import { Card } from "./Card"

const STOCKTAKING_SHEETNAME = "棚卸し"

type Props = {
  stocktaking: Stocktaking | null
  setter: (st: Stocktaking) => void
}

export const StocktakingFile: FC<Props> = ({
  stocktaking,
  setter,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const readStocktaking = async () => {
    if (inputRef.current?.files?.length) {
      const book = await readBook(inputRef.current.files[0])
      const rows = utils.sheet_to_json<SheetRow>(book.Sheets[STOCKTAKING_SHEETNAME], { header: 1 })
      setter({
        shopName: rows[0][1]?.toString() ?? "empty",
        rows: rows,
      })
    }
  }

  return stocktaking
    ? (
      <Card>
        <h2>{stocktaking.shopName}</h2>
        <p>SKU: {100}</p>
        <p>総在庫数: {1000}</p>
      </Card>
    )
    : (
      <Card>
        <p>棚卸ファイル</p>
        <input
          type="file"
          ref={inputRef}
          onChange={readStocktaking}
        />
      </Card>
    )
}
