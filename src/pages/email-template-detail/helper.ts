const startHTML = `<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <title>Email Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
            /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */
            @media screen {
                @font-face {
                    font-family: "Source Sans Pro";
                    font-style: normal;
                    font-weight: 400;
                    src: local("Source Sans Pro Regular"),
                    local("SourceSansPro-Regular"),
                    url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff)
                        format("woff");
                }
                @font-face {
                    font-family: "Source Sans Pro";
                    font-style: normal;
                    font-weight: 700;
                    src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
                    url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff)
                        format("woff");
                }
            }
        </style>
    </head>      
    <body>
        <!-- start preheader -->
        <div
            class="preheader"
            style="
                display: none;
                max-width: 0;
                max-height: 0;
                overflow: hidden;
                font-size: 1px;
                line-height: 1px;
                color: #fff;
                opacity: 0;
            "
        >
        `;

const midHTML = `
        </div>
        <!-- end preheader -->
        <div style="
            width: 100%;
            border: 1px solid #d9d9d9;
            background-color: #e9ecef;
            padding: 70px 10px;
            text-align: center;
        ">
            <div style="
                width: 100%;
                height: 100%;
                max-width: 600px;
                background-color: #fff;
                padding: 36px 24px;
                margin: auto;
                text-align: left;
            ">
            `;

const endHTML = `
            </div>
        </div>
    </body>
</html>`;

export const getHTMLByContent = (content: string, pre_header: string) => {
  const element = document.createElement("div");
  element.innerHTML = content;
  const spans = element.querySelectorAll(
    `a > span[style*="background-color: rgb"]:not([style*="background-color: rgb(255,"])`
  );
  Array.from(spans).map((item) => {
    const currentStyle = item.getAttribute("style");
    item.setAttribute(
      "style",
      currentStyle +
        " display: inline-block; margin: 16px; padding: 12px 36px; border-radius: 6px;"
    );
  });
  return startHTML + pre_header + midHTML + element.innerHTML + endHTML;
};

export const getContentByHTML = (html: string) => {
  const lastHTML = html.split(midHTML)[1];
  if (lastHTML) return lastHTML?.replace(endHTML, "");
  return html;
};
