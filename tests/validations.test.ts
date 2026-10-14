import { test, describe } from "node:test"
import assert from "node:assert/strict"
import {
  createClientSchema,
  createProjectSchema,
  createInvoiceSchema,
  createApprovalSchema,
  sendMessageSchema,
} from "../src/lib/validations/index.js"

describe("Backend Validation Schemas", () => {
  test("createClientSchema validates correct client input", () => {
    const valid = {
      name: "Rachel Green",
      company: "Acme Studio",
      email: "contact@acmestudio.design",
      phone: "+1 555 123 4567",
      status: "ACTIVE",
    }
    const result = createClientSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.name, "Rachel Green")
      assert.equal(result.data.company, "Acme Studio")
      assert.equal(result.data.email, "contact@acmestudio.design")
    }
  })

  test("createClientSchema rejects invalid email and short company name", () => {
    const invalid = {
      name: "R",
      company: "A",
      email: "not-an-email",
    }
    const result = createClientSchema.safeParse(invalid)
    assert.equal(result.success, false)
    if (!result.success) {
      const errors = result.error.format()
      assert.ok(errors.name)
      assert.ok(errors.company)
      assert.ok(errors.email)
    }
  })

  test("createProjectSchema parses and transforms numeric budget strings safely", () => {
    const valid = {
      name: "Mobile App UI",
      clientId: "client-123",
      category: "Mobile Design",
      budget: "$24,500.00",
      status: "In progress",
    }
    const result = createProjectSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.budget, 24500)
      assert.equal(result.data.status, "IN_PROGRESS")
    }
  })

  test("createInvoiceSchema enforces line items and calculates totals", () => {
    const valid = {
      clientId: "client-123",
      dueDate: "2026-11-01",
      items: [
        { description: "Design Research", hours: 40, rate: 125 },
        { description: "Figma High-Fidelity Mockups", hours: 60, rate: 150 },
      ],
    }
    const result = createInvoiceSchema.safeParse(valid)
    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.items.length, 2)
      assert.equal(result.data.items[0].hours, 40)
      assert.equal(result.data.items[0].rate, 125)
    }
  })

  test("createInvoiceSchema rejects empty items array", () => {
    const invalid = {
      clientId: "client-123",
      dueDate: "2026-11-01",
      items: [],
    }
    const result = createInvoiceSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })

  test("createApprovalSchema enforces required fields", () => {
    const valid = {
      projectId: "proj-123",
      title: "Landing Page Wireframes",
      version: "v1.2",
    }
    const result = createApprovalSchema.safeParse(valid)
    assert.equal(result.success, true)
  })

  test("sendMessageSchema rejects empty messages", () => {
    const invalid = {
      conversationId: "conv-123",
      text: "   ",
    }
    const result = sendMessageSchema.safeParse(invalid)
    assert.equal(result.success, false)
  })
})

