const basePath = process.cwd()
const fs = require("fs")
const path = require("path")
const axios = require("axios").default
require('dotenv').config()
const TIMEOUT = 500
// const CONTRACT_ADDRESS = '0xed5af388653567af2f388e6224dc7c4b3241c544' // CodeCats NFT Collection
// const CHAIN = 'ethereum'

exports.calculateRarities = async ({ contractAddress, networkChain }) => {
  return new Promise(async (resolve, reject) => {
    const nfts = []
    let page_number = 1

    const first_page = await getNftData(contractAddress, page_number, networkChain)
    const total_pages = first_page.total
    const last_page = Math.ceil(total_pages / 50)
    page_number++
    nfts.push(...first_page.nfts)

    while (page_number <= last_page) {
      await timer(TIMEOUT)
      const page_data = await getNftData(contractAddress, page_number, networkChain)
      page_number++
      nfts.push(...page_data.nfts)
    }
    let response = await processRarity(nfts)
    if (response) resolve(response)
  }).catch(e => reject(e));

}

function timer(ms) {
  return new Promise(res => setTimeout(res, ms))
}

function getNftData(contract_address, page_number, chain) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: `https://api.nftport.xyz/v0/nfts/${contract_address}`,
      params: {
        chain: chain,
        page_number: page_number,
        include: 'all',
        refresh_metadata: 'true'
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.NFTPORT_API_KEY
      }
    }

    axios.request(options).then(function (response) {
      console.log(`Recieved Page ${page_number}`)
      resolve(response.data)
    }).catch(function (error) {
      console.error(error)
      reject(error)
    })
  })
}

function processRarity(nfts) {
  console.log('Processing Rarity')
  const rarity = {}
  let user;
  // loop through all nfts
  for (const nft of nfts) {
    // check if attributes exist
    if (nft.metadata?.attributes?.length > 0) {
      // loop through all attributes
      for (attribute of nft.metadata.attributes) {
        // add trait type to rarity object if it doesn't exist
        if (!rarity[attribute.trait_type]) {
          rarity[attribute.trait_type] = {}
        }
        // add attribute value to rarity object if it doesn't exist and set count to 0
        if (!rarity[attribute.trait_type][attribute.value]) {
          rarity[attribute.trait_type][attribute.value] = {
            count: 0
          }
        }
        // increment count of trait type
        rarity[attribute.trait_type][attribute.value].count++
        // add rarity score to rarity object for each trait type
        rarity[attribute.trait_type][attribute.value].rarityScore = (1 / (rarity[attribute.trait_type][attribute.value].count / nfts.length)).toFixed(2)
      }
    }
  }

  // create a total rarity score for each nft by adding up all the rarity scores for each trait type
  let filterAndTotal = nfts
    .filter(nft => !!nft.metadata?.attributes)
    .map(nft => {
      let totalScore = 0;
      for (attribute of nft.metadata.attributes) {
        attribute.rarity_score = rarity[attribute.trait_type][attribute.value].rarityScore
        totalScore += parseFloat(attribute.rarity_score)
      }
      nft.total_rarity_score = +parseFloat(totalScore).toFixed(2)
      return nft
    })

  // sort and rank nfts by total rarity score
  let sortAndRank = filterAndTotal
    .sort((a, b) => b.total_rarity_score - a.total_rarity_score)
    .map((nft, index) => {
      nft.rank = index + 1
      return nft
    })
    .sort((a, b) => a.token_id - b.token_id)

  // if (!fs.existsSync(path.join(`${basePath}`, "/rarity"))) {
  //   fs.mkdirSync(path.join(`${basePath}`, "rarity"));
  // }
  // fs.writeFileSync(`${basePath}/rarity/_rarity_data.json`, JSON.stringify(sortAndRank, null, 2))



  // const rawdata = fs.readFileSync(
  //   `${basePath}/rarity/_rarity_data.json`
  // );
  // const newnfts = JSON.parse(rawdata);

  // // const sortedNfts = newnfts.sort(
  // //   (a, b) => b.total_rarity_score - a.total_rarity_score
  // // );
  // const topNfts = newnfts.slice(0, sortAndRank.length);
  // let response = topNfts.map(({ rank, total_rarity_score, metadata: { name } }) => {
  //   return {
  //     name,
  //     rank,
  //     total_rarity_score,
  //   };
  // })
  return sortAndRank;
}

// getRarity()
