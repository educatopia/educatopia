# Roadmap

1. Exercise Wiki
    a. Bootstrap 3 \[DONE\]
        i. cOnsider moving to a templating system like Jade, so that
            exercises can be retrieved like: <educatopia.org/exercise/123456>
        ii. In my opinion this would make code easier to maintain,

    b. Formular in edit tab
    c. URL restructuring
    d. HTML to markdown
        i. This should be solved the following way:
            Save markdown as well as the generated HTML inside the DB.
            Imagine the computing power that this will save if we did not
            regenerate HTML for every request received!

    e. Replace backslash with acute in database
    f. Finalize database schema
        i. Create a collection for every subject (correlates with ii)
        ii. Matching tasks to subjects
    g. Deployment
    h. User Profile (not searchable)
        i. Detailed statistics (how long per task, avg points etc)
    i. SEO
        how will the first users find us -
        make the DB indexable for search engines


2. Lesson path/graph
    a. Definition module
        i. Something like 'math for engineers'.
            I.e. a specific subject with its tasks

    b. Definition Goal
        i. Status of 'web developer' etc
        ii. A goal can be reached and a status attained
        iii. By reaching a goal you attain a status that can be
             displayed on your professional profile
        iv. Possibility to show status on external websites
            (E.g. on LinkedIn, XING, …)

    c. Graph = Interdependencies between modules
    d. Path = Sequence that modules have to be worked off
    e. Team


3. Cash flow
    a. Employee lookup service for companies
    b. Job search and detailed employee information for personal department


4. URL-Shortener
    - E.g. <edt.io>
