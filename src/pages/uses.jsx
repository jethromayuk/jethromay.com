import Head from 'next/head'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({ children, ...props }) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({ title, href, children }) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export default function Uses() {
  return (
    <>
      <Head>
        <title>Uses - Jethro May</title>
        <meta
          name="description"
          content="Inspired by Wes Bos, Freek Murze and many others, here's the software and services I rely on day-to-day. I'll keep this updated as my workflow evolves."
        />
        <link rel="canonical" href="https://jethromay.com/uses" />
        <meta property="og:url" content="https://jethromay.com/uses" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Uses - Jethro May" />
        <meta property="og:description" content="Inspired by Wes Bos, Freek Murze and many others, here's the software and services I rely on day-to-day. I'll keep this updated as my workflow evolves." />
        <meta property="og:image" content="https://jethromay.com/me.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Uses - Jethro May" />
        <meta name="twitter:description" content="Inspired by Wes Bos, Freek Murze and many others, here's the software and services I rely on day-to-day. I'll keep this updated as my workflow evolves." />
        <meta name="twitter:image" content="https://jethromay.com/me.jpg" />
      </Head>
      <SimpleLayout
        title="Software I use."
        intro="Inspired by Wes Bos, Freek Murze and many others, here's the software and services I rely on day-to-day. I'll keep this updated as my workflow evolves."
      >
        <div className="space-y-20">
          <ToolsSection title="Workstation">
            <Tool title='14” MacBook M3 Pro, 32GB RAM, 1TB SSD'>
                My everyday machine for both leading the team and getting hands-on with code. More than enough power for everything I throw at it.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Development tools">
            <Tool title="PHPStorm">
                I came back to PHPStorm after a few years on VS Code. When you're reviewing pull requests, debugging production issues, and jumping between projects all day, nothing else comes close.
            </Tool>
            <Tool title="Warp">
                Fast, clean, and packed with features that actually save time. It's become a core part of how I work.
            </Tool>
            <Tool title="Claude Code">
                An AI-powered coding assistant that lives in my terminal. I use it for everything from scaffolding features to refactoring and debugging — it's genuinely changed how I approach day-to-day development.
            </Tool>
            <Tool title="TablePlus">
                A solid, reliable database client that supports everything I need — MySQL, Redis, SQLite, and more. Clean interface that stays out of the way when I'm troubleshooting data issues across projects.
            </Tool>
            <Tool title="GitHub">
                Where all our code lives. I moved the team here from GitLab and BitBucket years ago — the workflow, integrations, and ecosystem for open-source make it the obvious choice.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Design">
            <Tool title="Sip">
                A simple colour picker that works across apps and websites. Handy when I'm reviewing designs or checking brand consistency across projects.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Productivity">
            <Tool title="Raycast">
                Replaced Alfred and never looked back. It's fast, free, and the extensions ecosystem means I can automate a lot of the repetitive stuff that comes with managing multiple projects.
            </Tool>
            <Tool title="CleanShot X">
                The best screenshot tool on Mac, full stop. Annotations, scrolling capture, and quick sharing make it invaluable for bug reports, feedback, and documenting work for the team.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Hosting">
            <Tool title="Vercel">
                My go-to for static sites and serverless functions. The deployment pipeline is effortless, which means less time on infrastructure and more time on the work that matters.
            </Tool>
            <Tool title="Hetzner">
                Excellent price-to-performance, reliable infrastructure, and straightforward server management. A strong choice for projects where you need more control than a managed platform gives you.
            </Tool>
            <Tool title="Cloudflare">
                I manage all my domains through Cloudflare. Lightning-fast DNS, solid security features, and zero-markup domain pricing make it a no-brainer.
            </Tool>
          </ToolsSection>
        </div>
      </SimpleLayout>
    </>
  )
}
