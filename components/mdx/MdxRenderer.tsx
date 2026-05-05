"use client";

import * as runtime from "react/jsx-runtime";
import { ConceptBox } from "./ConceptBox";
import { Callout } from "./Callout";
import { MiniChart } from "./MiniChart";
import { PullQuote } from "./PullQuote";

const sharedComponents = {
  ConceptBox,
  Callout,
  MiniChart,
  PullQuote,
};

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MdxRendererProps {
  code: string;
}

export function MdxRenderer({ code }: MdxRendererProps) {
  const Component = useMDXComponent(code);
  return <Component components={sharedComponents} />;
}
