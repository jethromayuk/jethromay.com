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
          content="Inspired by Wes Bos, Freek Murze and many others I've put together this list of hardware, software and services that I use on a day-to-day basis. I will keep this list updated as my workflow changes."
        />
      </Head>
      <SimpleLayout
        title="Software I use."
        intro="Inspired by Wes Bos, Freek Murze and many others I've put together this list of hardware, software and services that I use on a day-to-day basis. I will keep this list updated as my workflow changes. "
      >
        <div className="space-y-20">
          <ToolsSection title="Workstation">
            <Tool title="16” MacBook Pro, i7, 16GB RAM, 500GB SSD (2019)">
                This is my every day development machine that I use for both work and personal projects.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Development tools">
            <Tool title="Visual Studio Code">
                I was previously a long-time PHPStorm user, however due to developing in multiple languages I needed a multi-purpose code editor. I am also continually blown away at how great the extension ecosystem is. 
            </Tool>
            <Tool title="Warp">
                Easy to use, ridiculously fast and it comes with game changing features.
            </Tool>
            <Tool title="TablePlus">
                Sequel Pro was my go-to database management tool for some time, however development slowed down and I needed a stable database client. TablePlus also supports multiple drivers such as Redis & SQLite, to name a few.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Design">
            <Tool title="Sip">
                An easy to use color picker, that works across apps and websites. 
            </Tool>
          </ToolsSection>
          <ToolsSection title="Productivity">
            <Tool title="Alfred">
                When I first heard of Alfred, I wasn't sure that I needed it. After using it for some time, I realised how great it actually is. I have many custom workflows that are core to my development process. 
            </Tool>
          </ToolsSection>
          <ToolsSection title="Hosting">
            <Tool title="Github">
                All of my code is stored on GitHub, I previously used GitLab, BitBucket and found they both had their issues. GitHub is easy to use and is the industry standard platform for open source projects. 
            </Tool>
            <Tool title="Vercel">
                All of my code is stored on GitHub, I previously used GitLab, BitBucket and found they both had their issues. GitHub is easy to use and is the industry standard platform for open source projects. 
            </Tool>
            <Tool title="Digital Ocean">
                All of my code is stored on GitHub, I previously used GitLab, BitBucket and found they both had their issues. GitHub is easy to use and is the industry standard platform for open source projects. 
            </Tool>
            <Tool title="Namecheap">
                All of my domains are registered via Namecheap, they are affordable and their interface is easy to use, no complaints. 
            </Tool>
          </ToolsSection>
        </div>
      </SimpleLayout>
    </>
  )
}
