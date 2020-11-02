import Head from 'next/head'
import { useState } from "react"
import styled from "@emotion/styled"
import { StocktakingFile } from "../components/StocktakingFile"
import { CountFile } from "../components/CountFile"

const Home = () => {
  const [stocktaking, setStocktaking] = useState<Stocktaking | null>(null)
  const [countFile, setCountFile] = useState<CountFile | null>(null)

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
