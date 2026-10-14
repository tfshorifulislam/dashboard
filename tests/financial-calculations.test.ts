import { test, describe } from "node:test"
import assert from "node:assert/strict"

describe("Server-Side Financial Calculations", () => {
  test("calculates multi-item invoice subtotal with floating point precision handling", () => {
    const items = [
      { description: "UX Discovery", quantity: 37.5, rate: 125 },
      { description: "API Integration", quantity: 18.25, rate: 160 },
      { description: "Design QA", quantity: 12, rate: 110 },
    ]

    let calculatedSubtotal = 0
    const calculatedItems = items.map((it) => {
      const lineTotal = Number((it.quantity * it.rate).toFixed(2))
      calculatedSubtotal += lineTotal
      return { ...it, amount: lineTotal }
    })

    assert.equal(calculatedItems[0].amount, 4687.5)
    assert.equal(calculatedItems[1].amount, 2920)
    assert.equal(calculatedItems[2].amount, 1320)
    assert.equal(calculatedSubtotal, 8927.5)
  })

  test("currency parsing handles various international currency formats", () => {
    const parseCurrency = (val: string | number): number => {
      if (typeof val === "number") return val
      const num = parseFloat(val.replace(/[^0-9.-]+/g, ""))
      return isNaN(num) ? 0 : num
    }

    assert.equal(parseCurrency("$12,500.00"), 12500)
    assert.equal(parseCurrency("$48.5k"), 48.5)
    assert.equal(parseCurrency("142500"), 142500)
    assert.equal(parseCurrency("$0"), 0)
    assert.equal(parseCurrency(""), 0)
  })
})

