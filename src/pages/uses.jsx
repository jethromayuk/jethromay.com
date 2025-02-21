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
            <Tool title="14” MacBook M3 Pro, 32GB RAM, 1TB SSD">
                This is my every day development machine that I use for both work and personal projects.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Development tools">
            <Tool title="PHPStorm">
                I've returned to using PHPStorm after a number of years on Visual Studio Code. Nothing compares to the power that PHPStorm offers.
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
                I store all of my code on GitHub, having transitioned from GitLab and BitBucket due to various issues I encountered with these platforms. GitHub not only offers ease of use but also stands as the industry standard platform for open-source projects.
            </Tool>
            <Tool title="Vercel">
                I opt for Vercel as my hosting platform when my projects necessitate robust static site hosting and seamless integration of serverless functions.
            </Tool>
            <Tool title="Digital Ocean">
                I host on DigitalOcean because it provides a highly scalable and flexible infrastructure with robust performance, coupled with an intuitive interface and competitive pricing, all of which greatly enhance my overall hosting experience.
            </Tool>
            <Tool title="Namecheap">
                I have registered all of my domains through Namecheap; not only are their services affordable, but their user interface is also exceptionally easy to navigate.
            </Tool>
          </ToolsSection>
        </div>
      </SimpleLayout>
    </>
  )
}
