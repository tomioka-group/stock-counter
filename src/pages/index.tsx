import Head from 'next/head'
import { useState } from "react"
import styled from "@emotion/styled"
import { writeFile, utils } from "xlsx"
import { StocktakingFile } from "../components/StocktakingFile"
import { CountFile } from "../components/CountFile"
import { cellToJAN, cellToInt } from "../utils/cellConverter"

type Item = {
  jan: string
  name: string
  count: number
}

const isEmpty = (row: SheetRow) => {
  if (row[1] === undefined) {
    return true
  } else {
    return false
  }
}

const Home = () => {
  const [stocktaking, setStocktaking] = useState<Stocktaking | null>(null)
  const [countFile, setCountFile] = useState<CountFile | null>(null)

  const sum = () => {
    if (stocktaking && countFile) {
      const itemMap = new Map<string, Item>()
      const otherMap = new Map<string, Item>()
      // init
      stocktaking.rows.forEach((row) => {
        if (isEmpty(row)) {
          console.log("empty JAN", row)

        } else {
          const jan = cellToJAN(row[1])
          const name = row[2]?.toString() ?? "empty"
          itemMap.set(jan, {
            jan,
            name,
            count: 0,
          })
        }
      })

      // sum
      countFile.rows.forEach((row, index) => {
        const jan = cellToJAN(row[0])
        const count = cellToInt(row[1])
        const target = itemMap.get(jan)

        if (target) {
          itemMap.set(jan, {
            ...target,
            count: target.count + count
          })
        } else {
          const otherTarget = otherMap.get(jan)
          if (otherTarget) {
            otherMap.set(jan, {
              ...otherTarget,
              count: otherTarget.count + count
            })
          } else {
            otherMap.set(jan, {
              jan,
              name: `index: ${index}`,
              count,
            })
          }
        }
      })

      // result
      const result = Array.from(itemMap.values())
      const total = result.reduce((pre, cur) => pre + cur.count, 0)
      const other_total = Array.from(otherMap.values()).reduce((pre, cur) => pre + cur.count, 0)
      console.log("total", total)
      console.log("other", other_total)
      console.log("=>", total + other_total)

      // output
      const converted = result.map(item => [
        "",       // A
        item.jan, // B
        item.name,
        null,
        null,
        null,
        item.count // G
      ])
      utils.aoa_to_sheet
      const newSheet = utils.aoa_to_sheet([["ネット"], [],...converted])
      const newBook = utils.book_new()
      utils.book_append_sheet(newBook, newSheet)
      writeFile(newBook, "ネット.xlsx")
    }
  }

  return (
    <div>
      <Head>
        <title>catcount</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>CatCount</h1>

      <Flex>
        <StocktakingFile
          stocktaking={stocktaking}
          setter={setStocktaking}
        />
        <CountFile
          countFile={countFile}
          setter={setCountFile}
        />
      </Flex>

      <button onClick={sum}>START</button>
    </div>
  )
}

const Flex = styled.div`
  display: flex;

  & > div {
    margin: 10px;
  }
`

export default Home
