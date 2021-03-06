/*
Copyright (c) 2011-2013 F-Secure
See LICENSE for details
*/

/*jslint indent: 4, maxerr: 50, passfail: false, nomen: true*/
/*global define, document*/

define(["scripts/murphy/utils.js"], function (utils) {
    "use strict";
    var ThumbnailsView = function (container_element) {
        var container,
            thumb_width,
            thumb_height,
            setThumbnailSize,
            showImagePopup,
            addThumbnail;

        container = container_element;
        thumb_width = 300;
        thumb_height = 220;

        this.clear = function () {
            utils.removeChilds(container);
        };

        addThumbnail = function (image) {
            var source = image.href.baseVal,
                thumbnail,
                a_div;

            if (source.indexOf('/turtle.gif') === -1 && source.indexOf('data:image/gif;') === -1) {
                thumbnail = document.createElement("img");
                thumbnail.addEventListener('load', function (evt) { setThumbnailSize(evt.target); }, false);
                thumbnail.style.cursor = 'pointer';
                thumbnail.style.position = "relative";
                thumbnail.src = source;
                thumbnail.addEventListener('click', function (evt) { showImagePopup(evt.target); }, false);

                a_div = document.createElement("div");
                a_div.style.cssFloat = "left";
                a_div.style.width = thumb_width;
                a_div.style.height = thumb_height;
                a_div.style.padding = '2px';
                a_div.appendChild(thumbnail);
                container.appendChild(a_div);
            }
        };

        this.draw = function (svg_doc) {
            var nodes, node, node_index, images, i;

            this.clear();

            node = document.importNode(svg_doc.documentElement, true);
            nodes = node.getElementsByClassName("node");

            for (node_index = 1; node_index < nodes.length; node_index += 1) {
                images = nodes[node_index].getElementsByTagName("image");
                for (i = 0; i < images.length; i += 1) {
                    addThumbnail(images[i]);
                }
            }
        };

        setThumbnailSize = function (image) {
            var width, height, ratio, left_margin, top_margin;

            width = parseInt(image.width, 10);
            height = parseInt(image.height, 10);
            if (width > thumb_width || height > thumb_height) {
                ratio = width / height;
                image.height = thumb_height;
                image.width = thumb_height * ratio;
                if (image.width > thumb_width) {
                    image.width = thumb_width;
                    image.height = thumb_width / ratio;
                }
            }
            left_margin = parseInt((thumb_width - image.width) / 2, 10);
            top_margin = parseInt((thumb_height - image.height) / 2, 10);
            image.style.left = left_margin;
            image.style.top = top_margin;
        };

        showImagePopup = function (from_image) {
            var background_panel, image;

            background_panel = document.createElement("div");
            background_panel.className = 'popup-background-pane';
            background_panel.style.width = utils.getComputedWidth(document.body);
            background_panel.style.height = utils.getComputedHeight(document.body);

            image = document.createElement("img");
            image.style.position = 'absolute';
            image.addEventListener('click', function () {
                document.body.removeChild(image);
                document.body.removeChild(background_panel);
            });
            image.addEventListener('load', function () {
                image.style.left = (utils.getComputedWidth(document.body) - parseInt(image.width, 10)) / 2;
                image.style.top = (utils.getComputedHeight(document.body) - parseInt(image.height, 10)) / 2;
            });
            background_panel.addEventListener('click', function () {
                document.body.removeChild(image);
                document.body.removeChild(background_panel);
            });
            image.src = from_image.src;
            document.body.appendChild(background_panel);
            document.body.appendChild(image);
        };
    };

    return {ThumbnailsView: ThumbnailsView};
});
