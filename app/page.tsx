import { Heading1, Paragraph } from "@/components/Typography";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 justify-center text-center">
      <Heading1>TranSwitch</Heading1>
      <Paragraph>This project is still under active development!</Paragraph>
      <Paragraph>
        <span>Checkout the GitHub repo </span>
        <a
          className="text-zinc-600"
          href="https://github.com/sayatodev/transwitch"
        >
          here
        </a>
        <span>.</span>
        <br />
        <span>Or check out the hidden page </span>
        <a className="text-zinc-600" href="/switch/create">
          here
        </a>
        <span>.</span>
      </Paragraph>
    </div>
  );
}
