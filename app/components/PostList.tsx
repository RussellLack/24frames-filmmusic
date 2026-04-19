import Link from 'next/link'
import { formatDate, categoryLabel } from '@/lib/utils'

type PostRow = {
  _id: string
  title: string
  slug: { current: string }
  category: string
  subject?: string
  publishedAt: string
}

export default function PostList({ posts }: { posts: PostRow[] }) {
  if (!posts.length) {
    return <p className="empty-list">No posts.</p>
  }
  return (
    <>
      {posts.map((post) => (
        <Link key={post._id} href={`/blog/${post.slug.current}`} className="post-row">
          <span className="post-cat">{categoryLabel(post.category)}</span>
          <span className="post-title">{post.title}</span>
          {post.subject && <span className="post-subject">{post.subject}</span>}
          <span className="post-date">{formatDate(post.publishedAt, 'short')}</span>
        </Link>
      ))}
    </>
  )
}
