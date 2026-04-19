import Link from 'next/link'
import { formatDate } from '@/lib/utils'

type PostRow = {
  _id: string
  title: string
  slug: { current: string }
  subject?: string
  publishedAt: string
}

export default function PostList({ posts }: { posts: PostRow[] }) {
  if (!posts.length) {
    return <p className="empty-list">No posts.</p>
  }
  return (
    <ul className="post-index">
      {posts.map((post) => (
        <li key={post._id} className="post-entry">
          <Link href={`/blog/${post.slug.current}`} className="post-entry-link">
            <span className="post-entry-date">{formatDate(post.publishedAt, 'short')}</span>
            <h2 className="post-entry-title">{post.title}</h2>
            {post.subject && <p className="post-entry-subject">{post.subject}</p>}
          </Link>
        </li>
      ))}
    </ul>
  )
}
