import express, { Request, Response } from "express"; // Import express and types for Request and Response
const { v4: uuidv4 } = require("uuid");

const app = express(); // Create an instance of express
const port: number = 3000; // Define the port number

type Issue = {
  id: number | string;
  title: string;
  description: string;
};

let issues: Issue[] = [];

app.use(express.json());

// Define a route handler for the default home page
app.get("/issues", (req: Request, res: Response) => {
  res.json({
    status: "success",
    issues,
  });
});

app.post("/issues", (req: Request, res: Response) => {
  let issue = { ...req.body };
  // validate the body
  if (!issue.title) return res.json({ status: "failure", message: "The title field is required" });
  if (!issue.description) return res.json({ status: "failure", message: "The description field is required" });

  issue.id = uuidv4();

  // save to the database
  issues = [...issues, issue];
  res.json({ status: "success", issue });
});

app.delete("/issues/:id", (req: Request, res: Response) => {
  // if the issue exists, return it.
  const issueIndex = issues.findIndex((i) => i.id == req.params.id);
  const issue = issues[issueIndex];

  if (issue) {
    issues = issues.filter((i) => i.id != req.params.id);
    return res.json({ status: "success", message: "Issue has been deleted", issue });
  }

  res.status(404).json({ status: "failure", message: "Issue does not exist" });
});

app.put("/issues/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, description } = req.body;
  // if the issue exists, get it
  const issue = issues.filter((i) => i.id == id)?.[0];

  if (issue) {
    const newIssue = { ...issue, ...{ title, description } };
    issues = [...issues.filter((i) => i.id != req.params.id), newIssue];
    return res.json({ status: "success", issue: newIssue });
  }

  res.status(404).json({ status: "failure", message: "Issue does not exist" });
});

app.get("/issues/:id", (req: Request, res: Response) => {
  // if the issue exists, return it.
  const issue = issues.filter((i) => i.id == req.params.id)?.[0];

  if (issue) {
    return res.json({ status: "success", issue });
  }

  res.status(404).json({ status: "failure", message: "Issue does not exist" });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
