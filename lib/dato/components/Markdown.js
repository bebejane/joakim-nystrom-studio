import ReactMarkdown from "react-markdown";
import gfm from 'remark-gfm'
import Link from "next/link";
import truncateMarkdown  from 'markdown-truncate'

const Markdown = ({ children, truncate }) => {
  if(!children) return null

  children = !truncate ? children : truncateMarkdown(children, {limit:truncate, ellipsis:true})

  return (
    <ReactMarkdown 
      remarkPlugins={[gfm]} 
      children={children}
      components={{
        a: ({ node, ...props }) => 
        <Link prefetch={false} 
          href={props.href} 
          scroll={false}
        >
          <a>{props.children[0]}</a>
        </Link>
      }}
    />
  )
}

export default Markdown;

