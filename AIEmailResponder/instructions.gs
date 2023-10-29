// const EMAIL_ALIAS = “forms@example.com” 
// const CV_FILTER_TEXT = “RESUME/CV“
// const RESUME_FOLDER = “Resume Folder”
// const RESUME_REPLY_BODY = “Thank you for applying...”

// ~~~~~~~~~~~~~~ Background: ~~~~~~~~~~~~~~ 
//     • The plan is to download CVs and send replies to applicants (filter 1 + task 1) and to respond to inbound emails and set up meetings (filters 2-3 + task 2). It includes 2 AI tasks (A, B, C)
//     • The inbound emails are either structured form responses or free text emails. 

// ~~~~~~~~~~~~~~ Task 0 – Deciding what emails to do any actions with ~~~~~~~~~~~~~~ 
//     • Create a trigger to check an email inbox every ~15min 
//     • Do analysis of all emails received during that time
//     • Filter 1
//         ◦ Filter to only continue with emails sent to the alias EMAIL_ALIAS and that contain CV_FILTER_TEXT in the body of the email (the email is a form response in a structured format)
//         ◦ Send these to task 1
//     • Filter 2
//         ◦ Filter to only continue with emails sent to the alias EMAIL_ALIAS and that contain WEBSITE_FORM_1 or WEBSITE_FORM_2 in the body of the email (the email is a form response in a structured format)
//         ◦ Send these to task 2
//     • Filter 3
//         ◦ Filter to see if it’s a new email or if it’s a reply back from someone. Only continue if it's a new email thread
//         ◦ AI task A: Send the email address, title and body of the email to ChatGPT to understand if it’s an inquiry about a product/service (see services at the bottom)
//         ◦ If it’s about a product/service, continue with task 2

// ~~~~~~~~~~~~~~ Task 1 – downloading files and replying to applicants ~~~~~~~~~~~~~~ 
//     • Parse the email with regex to get the CV link (see example email), the first name, the email address and the Portfolio/GitHub/Other:
//     • Download the CV to a folder RESUME_FOLDER
//     • Create a draft email to the email of the applicant with HTML body “Hi Name,” and RESUME_REPLY_BODY

// ~~~~~~~~~~~~~~ Task 2 – responding to inbound emails  ~~~~~~~~~~~~~~ 
//     • AI task B: send the email info to ChatGPT to figure out if in any of the products 1-3 is suitable or if a sales call should be suggested.
//     • AI task C: Create a draft email using the info:
//         ◦ the received email text, 
//         ◦ if applicable, the info about the most suitable service and a link to buy → a brief pitch/sentence about that service
//         ◦ if applicable, suggesting a call

// const OPENAI_API_KEY= 