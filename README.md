# UmbracoCustomBlockview
A custom block view for the Umbraco back office showing the block alias, number of sub-items (if applicable), main image (if applicable) and listing sub-items with image and title

Usage:
- Place all the files under the App_Plugins folder, in a new folder called **CustomBlockView**.
- Edit the /config/config.json file to reflect your blocks and aliases.
- Launch the Umbraco back office and see your block list come to life :)


![image](https://user-images.githubusercontent.com/1838996/142765239-06c1b0e7-3e8a-46ed-8a8a-c7a7b9f9471a.png)

**How it works**

The config.json file contains all the info required for this view to work. Specifically, there are 4 property aliases you can set:

- **itemsAlias**: The property alias of your sub-items block list (if your block contains such sub-items)
- **titleAlias**: The property alias for the title of each sub-item
- **thumbsAlias**: The property alias for the image of each sub-item
- **mainImageAlias**: The property alias for the block's main image (if any)

There are also two default properties:
- **defaultItemsAlias**: The default property alias for any sub-items block list for any block not explicitly declared in the JSON file.
- **defaultTitleAlias**: The default property for sub-item titles for any block not explicitly declared in the JSON file.

For example, the Certifications / Awards section has the following setup:

![image](https://user-images.githubusercontent.com/1838996/142765573-489f84fc-5c2d-4d31-905a-57d3b14baf5d.png)

The alias of the Certifications/Awards block is "sectionClientLogosBlock".
The alias of sub-items block list is "items".
The alias of the titles and images of sub-items are "title" and "logo" respectively.

So the JSON part for this block would look like this. Not that the mainImageAlias property has an empty value since we don't have a main image for the block itself.
```
{
  "name": "sectionClientLogosBlock",
  "titleAlias": "title",
  "thumbsAlias": "logo",
  "itemsAlias": "items",
  "mainImageAlias": ""
},
```
