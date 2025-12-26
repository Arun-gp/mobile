async function fetchPage() {
    let data = await fetch('https://api.vercel.app/blog')
    let posts = await data.json()
    return posts
  }

  export async function GET(request) {
    const posts = await fetchCoins();
    const { searchParams } = new URL(request.url);
    console.log(searchParams.get('query'))
    const query = searchParams.get('query');

    const filteredCoins = posts.filter((post) => {
        return post.toLowerCase().includes(query.toLowerCase()) || post.toLowerCase().includes(query.toLowerCase())
    })

    return NextResponse.json(filteredCoins);
}