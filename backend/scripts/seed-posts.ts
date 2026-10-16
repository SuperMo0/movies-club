// Seeds the social feed with a handful of movie-rating posts from a few starter accounts.
//
//   npm run seed:posts -w backend            add the starter accounts and posts (re-running only refreshes the accounts)
//   npm run seed:posts -w backend -- --remove   delete the starter accounts and everything they posted
//
// The starter accounts get a random password nobody knows, so they can't be logged into.
import { randomUUID } from 'node:crypto'
import { prisma } from '../lib/prisma.ts'
import { hash } from '../lib/bcrypt.ts'

const POSTER = (file: string) => `https://media0106.elcinema.com/uploads/_315x420_${file}.jpg`
// Illustrated avatars (DiceBear "Notionists"), not photos: the starter accounts aren't real people.
const AVATAR = (seed: string, background: string) => `https://api.dicebear.com/9.x/notionists/png?seed=${seed}&size=256&backgroundColor=${background}`

const SEED_USERS = [
    { username: 'nour.hassan', name: 'Nour Hassan', bio: 'Horror at midnight, comedies on the weekend.', image: AVATAR('nour8', 'ffdfbf') },
    { username: 'omar_k', name: 'Omar Khaled', bio: 'IMAX or nothing.', image: AVATAR('omar2', 'd1d4f9') },
    { username: 'mariam.adel', name: 'Mariam Adel', bio: 'Book first, movie second.', image: AVATAR('mariam3', 'ffd5dc') },
    { username: 'youssef.films', name: 'Youssef Samir', bio: 'Rating every movie I watch in Cairo.', image: AVATAR('youssef8', 'b6e3f4') },
    { username: 'salma_t', name: 'Salma Tarek', bio: 'Animation and soundtracks.', image: AVATAR('salma4', 'c0aede') },
] as const

type SeedUsername = (typeof SEED_USERS)[number]['username']

type SeedPost = {
    author: SeedUsername,
    movieTitle: string,
    rating: number,
    content: string,
    image?: string,
    hoursAgo: number,
    likedBy: SeedUsername[],
    comments?: { author: SeedUsername, content: string }[],
}

const SEED_POSTS: SeedPost[] = [
    {
        author: 'salma_t',
        movieTitle: 'Princess Mononoke',
        rating: 5,
        content: "Finally saw Princess Mononoke on a real cinema screen. Joe Hisaishi's score in a proper hall hits completely different. If you've only ever watched it on a laptop, go before the re-release ends.",
        image: POSTER('1ae079042b2b8d2af636334a787dc1ec5c2d42b4c064b09237a1b7412d5d55f6'),
        hoursAgo: 3,
        likedBy: ['nour.hassan', 'mariam.adel', 'youssef.films', 'omar_k'],
        comments: [
            { author: 'mariam.adel', content: 'Going this weekend because of this post 🙌' },
            { author: 'omar_k', content: 'The forest scenes on a big screen are unreal.' },
        ],
    },
    {
        author: 'omar_k',
        movieTitle: 'The Odyssey',
        rating: 5,
        content: 'The Odyssey in IMAX was worth every pound. The Polyphemus sequence alone is the best thing I have seen in a cinema this year. Book the middle rows, trust me.',
        image: POSTER('493f09666e4a60c0491ea9bc9b2e2eb441f05518cf77ca20d0485d2c72b7403c'),
        hoursAgo: 9,
        likedBy: ['salma_t', 'youssef.films', 'nour.hassan'],
        comments: [
            { author: 'youssef.films', content: 'Which cinema did you go to?' },
            { author: 'omar_k', content: 'IMAX hall, late show. Totally full.' },
        ],
    },
    {
        author: 'nour.hassan',
        movieTitle: 'Insidious: Out of the Further',
        rating: 3,
        content: 'The jump scares land and the Further looks great on a big screen, but the middle part drags. Still a fun night out with a packed late-night crowd screaming together 😂',
        hoursAgo: 20,
        likedBy: ['salma_t'],
        comments: [{ author: 'salma_t', content: "The crowd is half the fun with these movies honestly" }],
    },
    {
        author: 'youssef.films',
        movieTitle: 'Al Qisas',
        rating: 4,
        content: 'A pianist dreaming of Vienna, set against Egypt between 1967 and 1984. It takes its time, but it is beautifully shot and the piano pieces stayed with me all the way home.',
        image: POSTER('3f3774066959f55fefb0842e2b3895e3cd40d1e4f8f154a0dde7edea0d9a0a9b'),
        hoursAgo: 28,
        likedBy: ['mariam.adel', 'salma_t'],
    },
    {
        author: 'mariam.adel',
        movieTitle: 'Verity',
        rating: 4,
        content: 'Read the Colleen Hoover book last summer, so I went in knowing the twist and was still tense the whole time. The Crawford house is so creepy. Go with a friend who has not read it and watch their face 👀',
        hoursAgo: 40,
        likedBy: ['nour.hassan', 'salma_t', 'youssef.films'],
        comments: [{ author: 'nour.hassan', content: 'No spoilers please, I am going tomorrow!' }],
    },
    {
        author: 'omar_k',
        movieTitle: 'Spider-Man: Brand New Day',
        rating: 5,
        content: 'Peter trying to have a normal college life and failing again is exactly what I wanted. The action looked incredible on the big screen and the audience clapped at the end.',
        image: POSTER('1e5fffc24a4c4853406e624aa899adb11f4fb52f97ca26ccc6bf853ec82d2cc8'),
        hoursAgo: 52,
        likedBy: ['youssef.films', 'nour.hassan', 'mariam.adel', 'salma_t'],
    },
    {
        author: 'nour.hassan',
        movieTitle: 'Whalefall',
        rating: 4,
        content: 'One hour of oxygen inside a whale. Such a simple idea and it works. The sound design does a lot of the heavy lifting. Not for anyone claustrophobic.',
        image: POSTER('7e62cbfe451481c700a9a0d9f5f262b2d397ab2f343a5175fac03f7f03814dba'),
        hoursAgo: 70,
        likedBy: ['omar_k'],
    },
    {
        author: 'salma_t',
        movieTitle: 'Red Flag',
        rating: 4,
        content: 'Took my husband to Red Flag and we kept looking at each other during half the jokes 😂 Light comedy about trust in young couples. Perfect date-night pick.',
        hoursAgo: 90,
        likedBy: ['mariam.adel', 'nour.hassan'],
        comments: [{ author: 'mariam.adel', content: 'Adding it to my list for Friday' }],
    },
    {
        author: 'youssef.films',
        movieTitle: 'Heart of the Beast',
        rating: 3,
        content: 'A Special Forces officer and his dog stranded in Alaska. The dog deserves an award. The story is predictable, but the survival scenes are genuinely intense.',
        image: POSTER('306573e6d38829645d54a81ad82ed66b530a9245d53b133b7fc30795e40dba8e'),
        hoursAgo: 110,
        likedBy: ['salma_t'],
    },
    {
        author: 'mariam.adel',
        movieTitle: 'Avengers Endgame: Encore re-release',
        rating: 4,
        content: 'Went to the Endgame encore with the same friends I saw it with the first time. People still cheered at all the same moments. Three hours flew by. Minus one star for my back 😅',
        hoursAgo: 130,
        likedBy: ['omar_k', 'youssef.films', 'nour.hassan'],
        comments: [{ author: 'omar_k', content: 'That cinema energy never gets old.' }],
    },
]

const seedUsernames = SEED_USERS.map(u => u.username)

async function seed() {
    // Accounts are always upserted so re-running refreshes their name, bio and avatar.
    const ids = {} as Record<SeedUsername, string>
    for (const user of SEED_USERS) {
        const saved = await prisma.user.upsert({
            where: { username: user.username },
            update: { name: user.name, bio: user.bio, image: user.image },
            create: { ...user, password: await hash(randomUUID()) },
        })
        ids[user.username] = saved.id
    }

    const existing = await prisma.post.count({ where: { authorId: { in: Object.values(ids) } } })
    if (existing > 0) {
        console.log(`Updated the ${SEED_USERS.length} starter accounts. Their posts are already there (${existing} posts).`)
        return
    }

    const now = Date.now()
    for (const post of SEED_POSTS) {
        const createdAt = new Date(now - post.hoursAgo * 60 * 60 * 1000)
        await prisma.post.create({
            data: {
                authorId: ids[post.author],
                movieTitle: post.movieTitle,
                rating: post.rating,
                content: post.content,
                image: post.image ?? null,
                createdAt,
                likedBy: { connect: post.likedBy.map(username => ({ id: ids[username] })) },
                comments: {
                    create: (post.comments ?? []).map((comment, i) => ({
                        authorId: ids[comment.author],
                        content: comment.content,
                        createdAt: new Date(createdAt.getTime() + (i + 1) * 25 * 60 * 1000),
                    })),
                },
            },
        })
    }

    console.log(`Added ${SEED_USERS.length} starter accounts and ${SEED_POSTS.length} posts.`)
}

async function remove() {
    const users = await prisma.user.findMany({ where: { username: { in: seedUsernames } }, select: { id: true } })
    const userIds = users.map(u => u.id)
    // Comments don't cascade when their post is deleted, so clear comments on starter posts first.
    const { count: comments } = await prisma.comment.deleteMany({ where: { post: { authorId: { in: userIds } } } })
    const { count: accounts } = await prisma.user.deleteMany({ where: { id: { in: userIds } } })
    console.log(`Removed ${accounts} starter accounts, their posts and ${comments} comments on those posts.`)
}

try {
    await (process.argv.includes('--remove') ? remove() : seed())
} finally {
    await prisma.$disconnect()
}
