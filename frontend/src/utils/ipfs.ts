export const uploadToIPFS = async (file: File): Promise<string> => {
  const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
  
  if (!PINATA_JWT) {
    throw new Error('Pinata JWT is not configured in .env');
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to upload to IPFS: ${res.statusText}`);
  }

  const data = await res.json();
  return `ipfs://${data.IpfsHash}`;
};
