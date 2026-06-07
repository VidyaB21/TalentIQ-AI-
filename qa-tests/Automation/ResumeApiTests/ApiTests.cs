using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using Xunit;

public class ResumeApiTests
{
    private readonly HttpClient _client = new HttpClient
    {
        BaseAddress = new Uri("http://localhost:5000/api/")
    };

    [Fact]
    public async Task Register_ShouldReturn200()
    {
        var payload = JsonConvert.SerializeObject(new {
            name = "Test User", email = "test@test.com", password = "Test@1234"
        });
        var content = new StringContent(payload, Encoding.UTF8, "application/json");
        var response = await _client.PostAsync("auth/register", content);
        Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Analyze_WithoutAuth_ShouldReturn401()
    {
        var response = await _client.PostAsync("resume/analyze", null);
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }
}