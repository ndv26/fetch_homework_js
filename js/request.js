export async function sendRequest(apiUrl, config = {}) {
    try {
        const response = await fetch(apiUrl, {
            method: config.method || "GET",
            body: config.body
                ? JSON.stringify({
                      data: {
                          ...config.body,
                      },
                  })
                : null,
            headers: {
                "Content-Type": "application/json",
            },
        });
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error.message || "Something went wrong!");
        }

        return responseData.data;
    } catch (error) {
        return alert(error);
    }
}
