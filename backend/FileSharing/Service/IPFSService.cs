using FileSharing.Configuration;
using Microsoft.Extensions.Options;

namespace FileSharing.Service
{
    public class IPFSService
    {
        private readonly HttpClient _httpClient;
        private readonly string _ipfsUrl;
        private readonly ILogger<IPFSService> _logger;

        public IPFSService(
            HttpClient httpClient, 
            IOptions<IPFSSettings> settings,
            ILogger<IPFSService> logger)
        {
            _httpClient = httpClient;
            _ipfsUrl = settings.Value.IpfsUrl;
            _logger = logger;
        }

        public async Task<string> AddFileAsync(Stream fileStream)
        {
            try
            {
                var content = new MultipartFormDataContent();
                content.Add(new StreamContent(fileStream), "file", "file");

                var response = await _httpClient.PostAsync($"{_ipfsUrl}/api/v0/add", content);
                response.EnsureSuccessStatusCode();

                var result = await response.Content.ReadFromJsonAsync<AddFileResponse>();
                return result?.Hash ?? throw new Exception("IPFS hash was null");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file to IPFS");
                throw;
            }
        }

        public async Task<Stream> GetFileAsync(string cid)
        {
            try
            {
                _logger.LogInformation($"Retrieving file with CID {cid} from IPFS");
                
                var response = await _httpClient.PostAsync(
                    $"{_ipfsUrl}/api/v0/cat?arg={cid}",
                    null
                );
                
                response.EnsureSuccessStatusCode();
                
               
                var memoryStream = new MemoryStream();
                await response.Content.CopyToAsync(memoryStream);
                memoryStream.Position = 0; 
                
                return memoryStream;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving file with CID {cid} from IPFS");
                throw new Exception($"Failed to retrieve file from IPFS: {ex.Message}");
            }
        }

        public async Task UnpinFileAsync(string cid)
        {
            try
            {
                _logger.LogInformation($"Unpinning file with CID {cid} from IPFS");
                
                var response = await _httpClient.PostAsync(
                    $"{_ipfsUrl}/api/v0/pin/rm?arg={cid}",
                    null
                );
                
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error unpinning file with CID {cid} from IPFS");
                throw new Exception($"Failed to unpin file from IPFS: {ex.Message}");
            }
        }

        private class AddFileResponse
        {
            public string? Hash { get; set; }
        }
    }
}