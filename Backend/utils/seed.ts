import { prisma } from './../lib/prisma.ts'
import bcrypt from 'bcrypt'

type SeedMovie = {
  id: string
  image: string
  title: string
  description: string
  genre: string[]
}

const moviesList: SeedMovie[] = [
  {
    id: '2094918',
    image:
      'https://media0093.elcinema.com/uploads/_315x420_664c6a111ac72b3b06b61699a676f1f7d6ac19ba2fa7d6e694ea3f4e144c5fc4.jpg',
    title: '28 Years Later: The Bone Temple',
    description:
      'Twenty-eight years after the Rage Virus outbreak, a messenger wakes from his coma to find that zombies have taken over the globe.',
    genre: ['Thriller', 'Horror'],
  },
  {
    id: '2097729',
    image:
      'https://media0093.elcinema.com/uploads/_315x420_bb1e41a45742e0f2743df92e979454343aef15e7600bbe9fa54eb7a958757428.jpg',
    title: "Doraemon: Nobita's Art World Tales",
    description:
      'A mysterious wooden panel in Nobita\'s living room transports him, Doraemon, and his pals to the fantastical Kingdom of "Artoria," which is based on paintings.',
    genre: ['Thriller', 'Fantasy', 'Family', 'Drama', 'Comedy', 'Adventure', 'Animation'],
  },
  {
    id: '2096221',
    image:
      'https://media0093.elcinema.com/uploads/_315x420_029a29f87e9c25b3b3f7abd80f1dc945758dd9bb5a391bf117954bd4d44b1fd5.jpg',
    title: 'Nuremberg',
    description:
      'The story follows American psychiatrist Douglas Kelley, who is tasked with assessing whether Nazi leaders are fit to stand trial for war crimes.',
    genre: ['War', 'Thriller', 'History', 'Drama', 'Biography'],
  },
  {
    id: '2085671',
    image:
      'https://media0093.elcinema.com/uploads/_315x420_0176fc95a25fed3e328207932ff2fe6fb6128432a6f53136193d94432658cc9a.jpg',
    title: 'Rocky El Ghalaba',
    description:
      'A young girl works as a bodyguard and is responsible for guarding and securing a major businessman, and together, they go through many interesting comedic situations.',
    genre: ['Comedy', 'Action'],
  },
  {
    id: '2010357',
    image:
      'https://media0093.elcinema.com/uploads/_315x420_a91cc9d9e3a04c58339b66ac31d2462bba9b83eb3aae48c7cc5e3ad9be1aa233.jpg',
    title: 'Avatar: Fire and Ash',
    description:
      "In the third part of Avatar, ex-human Jake Sully, who lives with the Na'vi clan, continues his adventures in light of the new challenges facing the clan.",
    genre: ['Fantasy', 'Adventure', 'Action', 'Science Fiction', 'Thriller'],
  },
]

function getMovieId(movieMap: Record<string, { id: string }>, title: string): string {
  const movie = movieMap[title]
  if (!movie) throw new Error(`Missing seeded movie: ${title}`)
  return movie.id
}

async function main(): Promise<void> {
  console.log('🌱 Starting seed...')

  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.genre.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Database cleaned.')

  const hashedPassword = await bcrypt.hash('password123', 10)

  const userSarah = await prisma.user.create({
    data: {
      username: 'sarah_movies',
      name: 'Sarah Jenkins',
      password: hashedPassword,
      image: 'https://i.pravatar.cc/150?u=sarah',
      bio: 'Cinema addict 🍿 | Sci-Fi lover. "Movies touch our hearts and awaken our vision."',
      joinedAt: new Date('2023-01-15'),
    },
  })

  const userMike = await prisma.user.create({
    data: {
      username: 'mike_critic',
      name: 'Mike Ross',
      password: hashedPassword,
      image: 'https://i.pravatar.cc/150?u=mike',
      bio: 'Honest reviews only. If the script is bad, I will say it. 📉',
      joinedAt: new Date('2023-03-10'),
    },
  })

  const userEmily = await prisma.user.create({
    data: {
      username: 'emily_b',
      name: 'Emily Blunt',
      password: hashedPassword,
      image: 'https://i.pravatar.cc/150?u=emily',
      bio: 'Just here for the popcorn and vibes ✨. Rom-com enthusiast.',
      joinedAt: new Date('2023-06-22'),
    },
  })

  const userDave = await prisma.user.create({
    data: {
      username: 'dave_directs',
      name: 'David Chen',
      password: hashedPassword,
      image: 'https://i.pravatar.cc/150?u=dave',
      bio: 'Filmmaker & Editor 🎥 | Obsessed with cinematography and lighting.',
      joinedAt: new Date('2023-08-05'),
    },
  })

  console.log('👥 Users created.')

  const movieMap: Record<string, { id: string }> = {}

  for (const movieEntry of moviesList) {
    const createdMovie = await prisma.movie.create({
      data: {
        title: movieEntry.title,
        sourceId: movieEntry.id,
        description: movieEntry.description,
        image: movieEntry.image,
        genres: {
          connectOrCreate: movieEntry.genre.map((genreName) => ({
            where: { name: genreName },
            create: { name: genreName },
          })),
        },
      },
    })
    movieMap[movieEntry.title] = createdMovie
  }

  console.log('🎬 Movies created.')

  const post1 = await prisma.post.create({
    data: {
      content:
        'Finally! The Rage Virus is back. The atmosphere in the trailer alone gave me chills. Can Danny Boyle do it again?',
      image: 'https://cdn.mos.cms.futurecdn.net/hK2N8k5qGj9Y7y8F8.jpg',
      rating: 5,
      authorId: userSarah.id,
      movieId: getMovieId(movieMap, '28 Years Later: The Bone Temple'),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  })

  const post2 = await prisma.post.create({
    data: {
      content:
        'Honestly surprisingly funny. The action choreography was decent for a comedy, but the third act dragged a bit.',
      image: null,
      rating: 3,
      authorId: userMike.id,
      movieId: getMovieId(movieMap, 'Rocky El Ghalaba'),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
  })

  const post3 = await prisma.post.create({
    data: {
      content:
        'The psychological tension in the interrogation scenes is palpable. The lighting choices really emphasize the moral ambiguity.',
      image: null,
      rating: null,
      authorId: userDave.id,
      movieId: getMovieId(movieMap, 'Nuremberg'),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  })

  const post4 = await prisma.post.create({
    data: {
      content:
        'Pandora never looked better! The visual effects for the fire clan are stunning. 10/10 experience.',
      image: 'https://people.com/thmb/avatar-fire-and-ash.jpg',
      rating: 5,
      authorId: userEmily.id,
      movieId: getMovieId(movieMap, 'Avatar: Fire and Ash'),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
  })

  console.log('📝 Posts created.')

  await prisma.comment.create({
    data: {
      content: 'I hope it is as scary as the first one!',
      authorId: userMike.id,
      postId: post1.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'Agreed, the jokes landed well.',
      authorId: userSarah.id,
      postId: post2.id,
    },
  })

  await prisma.post.update({
    where: { id: post1.id },
    data: {
      likedBy: {
        connect: [{ id: userMike.id }, { id: userEmily.id }, { id: userDave.id }],
      },
    },
  })

  await prisma.user.update({
    where: { id: userSarah.id },
    data: { following: { connect: [{ id: userMike.id }, { id: userDave.id }] } },
  })

  await prisma.user.update({
    where: { id: userMike.id },
    data: { following: { connect: [{ id: userSarah.id }] } },
  })

  await prisma.user.update({
    where: { id: userSarah.id },
    data: {
      watchList: {
        connect: [{ id: getMovieId(movieMap, 'Avatar: Fire and Ash') }, { id: getMovieId(movieMap, 'Nuremberg') }],
      },
    },
  })

  void post3
  void post4

  console.log('❤️ Interactions created.')
  console.log('✅ Seeding finished.')
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
