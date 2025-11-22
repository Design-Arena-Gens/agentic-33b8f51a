"use client";
import React, { useMemo, useState } from "react";
import { generateCode } from "@/lib/generateCode";
import CodeExample from "./CodeExample";

type Comparator = ">=" | ">" | "==" | "<=" | "<";

export default function LoopSimulator() {
  const [startValue, setStartValue] = useState<number>(1);
  const [step, setStep] = useState<number>(1);
  const [target, setTarget] = useState<number>(10);
  const [comparator, setComparator] = useState<Comparator>(">=");
  const [iterations, setIterations] = useState<Array<{ i: number; value: number }>>([]);
  const [stoppedBy, setStoppedBy] = useState<"condition" | "safety" | null>(null);

  const maxIterations = 1000;

  const conditionFn = useMemo(() => {
    return (v: number) => {
      switch (comparator) {
        case ">=": return v >= target;
        case ">": return v > target;
        case "==": return v === target;
        case "<=": return v <= target;
        case "<": return v < target;
      }
    };
  }, [comparator, target]);

  function run() {
    const log: Array<{ i: number; value: number }> = [];
    let value = startValue;
    let count = 0;
    let stopped: "condition" | "safety" | null = null;

    do {
      log.push({ i: count + 1, value });
      value = value + step;
      count++;

      if (count > maxIterations) { stopped = "safety"; break; }
    } while (!conditionFn(value));

    if (!stopped) stopped = "condition";
    setIterations(log);
    setStoppedBy(stopped);
  }

  function reset() {
    setIterations([]);
    setStoppedBy(null);
  }

  const { js, py, vb, pascal } = useMemo(() => (
    generateCode({ startValue, step, target, comparator })
  ), [startValue, step, target, comparator]);

  return (
    <section className="grid cols-2">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>????? Do...Until</h2>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label className="label">?????? ??????????</label>
            <input className="input" type="number" value={startValue} onChange={(e) => setStartValue(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">?????? (+/-)</label>
            <input className="input" type="number" value={step} onChange={(e) => setStep(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">?????</label>
            <input className="input" type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">???????? (??? ?????)</label>
            <select className="input" value={comparator} onChange={(e) => setComparator(e.target.value as Comparator)}>
              <option>{">="}</option>
              <option>{">"}</option>
              <option>{"=="}</option>
              <option>{"<="}</option>
              <option>{"<"}</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="button" onClick={run}>?????</button>
          <button className="button secondary" onClick={reset}>????? ?????</button>
        </div>
        <div style={{ marginTop: 16 }}>
          {stoppedBy === "safety" && (
            <div className="warning">?? ??????? ?????? ?? ???? ?? ?????? ??? ????? ???? ?????? ?????????: {maxIterations}</div>
          )}
          {stoppedBy === "condition" && iterations.length > 0 && (
            <div className="success">????? ?????? ??? ????? ???? ??????.</div>
          )}
        </div>
        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>??????</th>
              </tr>
            </thead>
            <tbody>
              {iterations.map((row) => (
                <tr key={row.i}>
                  <td>{row.i}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
              {iterations.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ color: "#8aa" }}>?? ???? ????? ???</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid">
        <CodeExample language="javascript" code={js} />
        <CodeExample language="python" code={py} />
        <CodeExample language="vb" code={vb} />
        <CodeExample language="pascal" code={pascal} />
      </div>
    </section>
  );
}
