# PayloadData Component - Quick Start Examples

## Visual Examples

### Example 1: User Profile Card

**What you want to display:**
A user profile with name, email, and role from your Payload `users` collection.

**Setup in Puck Editor:**

```
📦 PayloadData
   Settings:
   • Collection: users
   • Query Mode: Single Document
   • Document ID: 6789abc123def456
   
   Children:
   ├─ 📝 Heading
   │  └─ Text: "{{name}}"
   ├─ 📄 Text
   │  └─ Text: "Email: {{email}}"
   └─ 🔘 Button
      ├─ Label: "View Profile"
      └─ Href: "/profile/{{id}}"
```

**Result:**
```
┌──────────────────────────────┐
│ John Smith                   │  ← Heading
│ Email: john@example.com      │  ← Text
│ [ View Profile ]             │  ← Button (links to /profile/6789abc123def456)
└──────────────────────────────┘
```

---

### Example 2: Blog Post List

**What you want to display:**
A list of blog posts (assuming you have a `posts` collection).

**Setup in Puck Editor:**

```
📦 PayloadData
   Settings:
   • Collection: posts
   • Query Mode: Multiple Documents
   • Render Mode: Repeat for each item
   • Limit: 5
   
   Children:
   └─ 🃏 Card
      ├─ Title: "{{title}}"
      ├─ Description: "{{excerpt}}"
      ├─ Content: "By {{author.name}} on {{publishedAt}}"
      └─ Href: "/blog/{{slug}}"
```

**Result:**
```
┌────────────────────────────────────────┐
│ 🃏 Getting Started with Payload       │
│    A quick guide to Payload CMS...    │
│    By Sarah Johnson on 2024-01-15     │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 🃏 Building with Puck                 │
│    Learn how to create pages...       │
│    By Mike Chen on 2024-01-14         │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 🃏 TypeScript Best Practices          │
│    Tips for better TypeScript...      │
│    By Emma Davis on 2024-01-13        │
└────────────────────────────────────────┘
```

Each card is clickable and links to `/blog/{slug}`

---

### Example 3: Featured Media Gallery

**What you want to display:**
The first 6 images from your media collection in a grid.

**Setup in Puck Editor:**

```
📦 PayloadData
   Settings:
   • Collection: media
   • Query Mode: Multiple Documents
   • Render Mode: Repeat for each item
   • Limit: 6
   
   Children:
   └─ 🃏 Card
      ├─ Title: "{{alt}}"
      ├─ Description: "{{filename}}"
      └─ Icon: image
```

**Result:**
```
┌─────────┬─────────┬─────────┐
│ 🖼️ Logo │ 🖼️ Hero │ 🖼️ Team │
│ logo.png│ hero.jpg│ team.png│
├─────────┼─────────┼─────────┤
│ 🖼️ Prod │ 🖼️ Icon │ 🖼️ Banner│
│ prod.jpg│ icon.svg│ banner.jpg│
└─────────┴─────────┴─────────┘
```

---

### Example 4: Featured Item (Index Mode)

**What you want to display:**
Only the 3rd item (index 2) from a list of products.

**Setup in Puck Editor:**

```
📦 PayloadData
   Settings:
   • Collection: products
   • Query Mode: Multiple Documents
   • Render Mode: Select by index
   • Selected Index: 2
   
   Children:
   ├─ 📝 Heading
   │  └─ Text: "Featured: {{name}}"
   ├─ 📄 Text
   │  └─ Text: "{{description}}"
   └─ 🔘 Button
      ├─ Label: "Buy Now - ${{price}}"
      └─ Href: "/products/{{slug}}"
```

**Result:**
```
┌──────────────────────────────────┐
│ Featured: Premium Headphones     │  ← Shows only the 3rd product
│ High-quality wireless...         │
│ [ Buy Now - $299 ]              │
└──────────────────────────────────┘
```

---

### Example 5: Nested Data Access

**What you want to display:**
User data with nested profile information.

**Payload Data Structure:**
```json
{
  "id": "123",
  "email": "user@example.com",
  "profile": {
    "firstName": "Jane",
    "lastName": "Doe",
    "bio": "Software developer",
    "social": {
      "twitter": "@janedoe"
    }
  }
}
```

**Setup in Puck Editor:**

```
📦 PayloadData
   Settings:
   • Collection: users
   • Query Mode: Single Document
   • Document ID: 123
   
   Children:
   ├─ 📝 Heading
   │  └─ Text: "{{profile.firstName}} {{profile.lastName}}"
   ├─ 📄 Text
   │  └─ Text: "{{profile.bio}}"
   ├─ 📄 Text
   │  └─ Text: "Email: {{email}}"
   └─ 📄 Text
      └─ Text: "Twitter: {{profile.social.twitter}}"
```

**Result:**
```
┌──────────────────────────────────┐
│ Jane Doe                         │
│ Software developer               │
│ Email: user@example.com          │
│ Twitter: @janedoe                │
└──────────────────────────────────┘
```

---

## Common Template Patterns

### Basic Fields
```
{{name}}           → John Smith
{{email}}          → john@example.com
{{createdAt}}      → 2024-01-15T10:30:00Z
```

### Nested Objects
```
{{user.name}}               → John Smith
{{profile.bio}}             → Software developer
{{settings.theme.color}}    → blue
```

### Array Elements
```
{{tags.0}}              → First tag
{{images.1.url}}        → URL of second image
{{items.2.title}}       → Title of third item
```

### Combined
```
"Hello {{user.firstName}}!"                    → Hello John!
"Posted by {{author.name}} on {{date}}"       → Posted by Jane on 2024-01-15
"Price: ${{product.price}} {{product.currency}}" → Price: $99 USD
```

---

## Tips for Success

1. **Field Names Must Match Exactly**
   - Use `{{name}}`, not `{{Name}}` or `{{ name }}`
   - Spaces in `{{ }}` are trimmed, but exact field names matter

2. **Check Your Data Structure**
   - Use Payload admin panel to verify field names
   - Look at the collection's schema in `/collections/`

3. **Missing Fields Return Empty Strings**
   - If `{{profile.bio}}` is empty, nothing displays (no error)
   - Your layout won't break with missing data

4. **Use Limits for Performance**
   - Don't fetch 1000 items - use reasonable limits
   - Typical: 5-20 items for lists

5. **Test with Real Data**
   - Create test documents in Payload admin
   - Verify template patterns work with your data

---

## Where to Learn More

- **PAYLOADDATA_README.md** - Complete user guide
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **PLAN.md** - Architecture and design decisions

## Need Help?

Common issues and solutions:

**Template not working?**
→ Check field name in Payload admin

**No data showing?**
→ Verify Document ID or query settings

**Array is empty?**
→ Check Limit and where conditions

**Component not found?**
→ Make sure you added children to PayloadData slot
