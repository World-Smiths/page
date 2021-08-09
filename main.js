const indexfile = [
   {
       "name": "Test",
       "description": "<p>HTML world description</p>",
       "links": {
           "module": "https://github.com/user/repo/blob/main/module.json",
           "world": "https://github.com/user/repo/blob/main/world.json",
           "download": "https://github.com/user/repo/blob/main/package.zip"
       },
       "author": "World Smiths",
       "authors": [
           {
               "name": "Test"
           }
       ],
       "version": "0.3.0",
       "system": "dnd5e",
       "dependencies": [],
       "size": 0
   }
]; // put index.json here to work offline

let gotoBtn;
let worldsList;

// get JSON and generate page
const data = async () => {
   return fetch("https://raw.githubusercontent.com/World-Smiths/page/main/index.json")
      .then(response => {
         return response.json();
      }).catch(async err => {
         return indexfile;
      });
};

// Handle page load
async function load() {

   // Handle go to top button
   gotoBtn = document.getElementById("WSgotoTop");
   window.onscroll = () => {
      scrollFunction()
   };

   // Toggle dark mode
   const DARK = 'dark';
   const LIGHT = 'light';
   const THEME = 'mode';

   applyTheme();
   const toggleSwitch = document.getElementById("WScolor-toggle");

   toggleSwitch.onclick = function () {
      let currentMode = localStorage.getItem(THEME);
      localStorage.setItem(
         THEME,
         currentMode === DARK ? LIGHT : DARK
      );
      applyTheme();
   };

   function applyTheme() {
      let html = document.documentElement;
      let currentMode = localStorage.getItem(THEME);
      if (currentMode === DARK) {
         html.classList.add(DARK);
         document.getElementById("WScolor-toggle").innerHTML =
            '<i class="fa fa-sun-o"></i>';
         document.getElementById("WSdiscord").setAttribute("src", "https://discord.com/widget?id=873379131646160896&theme=dark");
      }
      else {
         html.classList.remove(DARK);
         document.getElementById("WScolor-toggle").innerHTML =
            '<i class="fa fa-moon-o"></i>';
         document.getElementById("WSdiscord").setAttribute("src", "https://discord.com/widget?id=873379131646160896&theme=light");
      };
   };

   // Create List
   const options = {
      valueNames: [
         "name",
         { attr: "onclick", name: "module" },
         { attr: "onclick", name: "world" },
         { attr: "onclick", name: "zip" },
         "description",
         "version",
         "authors",
         "size"
      ],
      item: `<details>
               <summary id="WStoggle">
                  <header id="WStitle-group">
                     <strong id="WStitle" class="name"></strong>
                     <div id="WSinstall">
                        <button id="WSinstall-dropdown" class="fa fa-download"></button>
                        <nav id="WSinstall-buttons">
                           <button id="WSinstall-module" class="module">Module</button>
                           <button id="WSinstall-world" class="world">World</button>
                           <button id="WSinstall-zip" class="zip">ZIP</button>
                        </nav>
                     </div>
                  </header>
               </summary>
               <content id="WSdetails">
                  <article id="WSdescription" class="description"></article>
                  <section id="WSsidebar">
                     <strong>Version: </strong><span class="version"></span><br/>
                     <strong>Authors: </strong><span class="authors"></span><br/>
                     <strong>Size: </strong><span class="size"></span><br/>
                  </section>
               </content>
            </details>`
   };
   worldsList = new List("WSworld-list", options);

   // Load data from index
   let index = await data();

   // Check if index has packages
   if (index.length !== 0) {
      // Add all unique packages as entries in the list
      index.forEach((package, i) => {

         // Get array of all unique authors
         let authorsArray = [package.author];
         package.authors.forEach(item => {
            if (!authorsArray.includes(item.name))
               authorsArray.push(item.name);
         });
         // Create string of authors
         let authorStr = authorsArray.join(", ");

         // Add to list
         worldsList.add({
            name: package.name,
            module: `navigator.clipboard.writeText('${package.links.module}')`,
            world: `navigator.clipboard.writeText('${package.links.world}')`,
            zip: `window.open('${package.links.download}')`,
            description: package.description,
            version: package.version,
            authors: authorStr,
            size: Math.round(package.size / 100) / 10 + " MB"
         });

         // Add link buttons depending on what is available for this package

         // Check if this package exists in module format and show the button for installing the module
         if (package.links.module) document.querySelectorAll("#WSinstall-module")[i].style.display = "block";

         // Check if this package exists in world format and show the button for installing the world
         if (package.links.module) document.querySelectorAll("#WSinstall-world")[i].style.display = "block";

         // Show the download button for the ZIP
         if (package.links.download) document.querySelectorAll("#WSinstall-zip")[i].style.display = "block";
      });

      // Focus search box
      document.getElementById("WSsearchbox").focus();

   } else {
      // Hide section if there is no index
      const resultsbox = document.getElementById("WSresults");
      resultsbox.style.display = "none";
   };
};

// Handle scrolling
function scrollFunction() {
   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      gotoBtn.style.display = "block";
   } else {
      gotoBtn.style.display = "none";
   };
};

// Handle goto top button
function topFunction() {
   document.body.scrollTop = 0;
   document.documentElement.scrollTop = 0;
};
