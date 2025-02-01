using System.Text.Json;
using FileSharing.Configuration;
using Microsoft.Extensions.Options;

namespace FileSharing.Service
{
    public class IPFSService
    {
        private readonly HttpClient _client;
        private readonly string _ipfsUrl;

        public IPFSService(HttpClient client, IOptions<IPFSSettings> options)
        {
            _client = client;
            _ipfsUrl = options.Value.IpfsUrl;
        }

        public async Task<string?> AddFileAsync(Stream stream)
        {
            using var content = new MultipartFormDataContent
            {
                { new StreamContent(stream), "file", "file" }
            };
            var response = await _client.PostAsync($"{_ipfsUrl}/api/v0/add", content);
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();

            return json.GetProperty("Hash").GetString();
        }

        public async Task<Stream> GetFileAsync(string cid)
        {
            var response = await _client.GetAsync($"{_ipfsUrl}/api/v0/cat?arg={cid}");
            return await response.Content.ReadAsStreamAsync();
        }

        public async Task<bool> UnpinFileAsync(string cid)
        {
            try
            {
                var response = await _client.PostAsync(
                    $"{_ipfsUrl}/api/v0/pin/rm?arg={cid}",
                    new StringContent("")
                );

                if (!response.IsSuccessStatusCode)
                    return false;

                var json = await response.Content.ReadFromJsonAsync<JsonElement>();
                return json.TryGetProperty("Pins", out _); 
            }
            catch
            {
                return false; 
            }
        }
    }
}