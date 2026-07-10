# External Image and Audio Resources

This project now supports using external image and audio paths instead of embedding large base64 data inside the JSON.

## Why use external assets?

- Embedded base64 image/audio greatly increases JSON size.
- Large JSON files can exceed browser storage limits when the game is loaded.
- Browsers typically limit `sessionStorage` to around 5–10 MB per origin.
- External paths keep your JSON small and allow larger media files.

## Supported fields

Each question object can include:

- `question`: the question text
- `answer`: the answer text
- `image`: optional image path or URL
- `audio`: optional audio path or URL
- `value`: optional numeric value

Example:

```json
{
  "gameName": "My Trivia Game",
  "categories": [
    {
      "title": "History",
      "questions": [
        {
          "value": 100,
          "question": "Who was the first president of the United States?",
          "answer": "George Washington",
          "image": "images/washington.jpg",
          "audio": "sounds/washington.mp3"
        }
      ]
    }
  ]
}
```

## What paths are supported

You can use:

- a relative path, e.g. `images/question1.png`
- an absolute site path, e.g. `/assets/question1.png`
- a URL, e.g. `https://example.com/audio.mp3`

The browser will load the resource directly from the provided path.

## Admin interface notes

In the admin question editor, you now have two ways to add media:

1. Upload a file directly — this will store a base64 data URI in the saved JSON.
2. Enter a file path or URL in the new text field — this stores the path as an external resource.

If both are provided, the uploaded file takes priority.

## When to prefer external paths

Use external paths when:

- your media files are large
- you want to avoid large JSON files
- you are loading a game with both images and audio

## Troubleshooting

- If you see an "Invalid JSON" or "Unable to load this game because it is too large" error, your JSON file may be too large.
- Reduce the file size or switch to external `image`/`audio` paths.
- Keep your JSON under 8 MB for safer loading.

## Important

The question page already supports both `q.image` and `q.audio` as direct sources, so external paths will work without additional code changes.
