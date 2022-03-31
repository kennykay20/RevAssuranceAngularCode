// export const environment = {
//   production: true,
//   apiURL:'http://www.mykolonaira.com/api.kolonaira'
// };


let url: string;
function readTextFile(file) {
    const rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status === 0)  {
              var allText = rawFile.responseText;
              url = allText.replace(/\s/g, "");
            }
        }
    }
    rawFile.send(null);
}

readTextFile('./assets/callback-url.txt');
export const environment = {
  production: true,
  apiURL:  url,
  apiLoginURL: url
};
