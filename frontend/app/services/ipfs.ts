import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { MemoryBlockstore } from 'blockstore-core'
import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5 // 5 minutes
})

let helia: any = null;
let fs: any = null;

export async function initHelia() {
  if (helia) return { helia, fs };

  const blockstore = new MemoryBlockstore()
  
  helia = await createHelia({
    blockstore,
    start: false
  })
  
  fs = unixfs(helia)
  
  return { helia, fs }
}

export async function uploadFile(file: File) {
  const { fs } = await initHelia()
  
  try {
    const buffer = await file.arrayBuffer()
    const cid = await fs.addBytes(new Uint8Array(buffer))
    
    // Cache the CID
    cache.set(cid.toString(), true)
    
    return cid.toString()
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw new Error('Failed to upload file to IPFS')
  }
}

export async function downloadFile(cid: string) {
  const { fs } = await initHelia()
  
  try {
    // Check cache first
    if (!cache.has(cid)) {
      throw new Error('File not found in cache')
    }

    const decoder = new TextDecoder()
    let data = ''

    for await (const chunk of fs.cat(cid)) {
      data += decoder.decode(chunk, { stream: true })
    }

    return data
  } catch (error) {
    console.error('Error downloading from IPFS:', error)
    throw new Error('Failed to download file from IPFS')
  }
}

// Clean up function
export async function cleanup() {
  if (helia) {
    await helia.stop()
    helia = null
    fs = null
  }
} 