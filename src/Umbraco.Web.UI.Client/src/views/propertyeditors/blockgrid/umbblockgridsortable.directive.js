(function () {
    'use strict';


/*
    function userAgent(pattern) {
        if (typeof window !== 'undefined' && window.navigator) {
            return !!navigator.userAgent.match(pattern);
        }
    }
    const FireFox = userAgent(/firefox/i);

*/

    function isWithinRect(x, y, rect, modifier) {
        return (x > rect.left - modifier && x < rect.right + modifier && y > rect.top - modifier && y < rect.bottom + modifier);
    }


    function getParentScrollElement(el, includeSelf) {
        // skip to window
        if (!el || !el.getBoundingClientRect) return null;
        var elem = el;
        var gotSelf = false;
    
        while(elem) {
            
            // we don't need to get elem css if it isn't even overflowing in the first place (performance)
            if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
                var elemCSS = getComputedStyle(elem);

                if (
                    elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')
                    ||
                    elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll')
                ) {
                    if (!elem.getBoundingClientRect || elem === document.body) return null;
                    if (gotSelf || includeSelf) return elem;
                    gotSelf = true;
                }
            }

            if(elem.parentNode === document) {
                return null;
            } else if(elem.parentNode instanceof DocumentFragment) {
                elem = elem.parentNode.host;
            } else {
                elem = elem.parentNode;
            }
        }
    
        return null;
    }
 



    const DefaultConfig = {
        compareElementToModel: (el, modelEntry) => modelEntry.contentUdi === el.dataset.elementUdi,
        querySelectModelToElement: (container, modelEntry) => container.querySelector(`[data-element-udi='${modelEntry.contentUdi}']`),
        identifier: "UmbBlockGridSorter",
        containerSelector: "ol", // Used for connecting with others
        ignorerSelector: "a, img, iframe",
        itemSelector: "li",
        placeholderClass: "umb-drag-placeholder"
        
        /*,
        ghostClass: "umb-drag-ghost"
        */
    }



    function UmbBlockGridSorter() {
        
        function link(scope, element) {


            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(addedNode) {
                        if (addedNode.matches && addedNode.matches(scope.config.itemSelector)) {
                            setupItem(addedNode);
                        }
                    });
                    mutation.removedNodes.forEach(function(removedNode) {
                        if (removedNode.matches && removedNode.matches(scope.config.itemSelector)) {
                            destroyItem(removedNode);
                        }
                    });
                });
            });


            let vm = {};

            const config = {...DefaultConfig, ...scope.config};

            vm.items = config.items;
            vm.identifier = config.identifier;

            let scrollElement = null;

            let containerEl = config.containerSelector ? element[0].closest(config.containerSelector) : element[0];
            if (!containerEl) {
                console.error("Could not initialize umb block grid sorter.", element[0])
                return;
            }

            

            function init() {

                containerEl['umbBlockGridSorter:vm'] = () => {
                    return vm;
                };
                //containerEl.addEventListener('dragover', preventDragOver);

                observer.observe(containerEl, {childList: true, subtree: false});
            }
            init();

            function preventDragOver(e) {
                e.preventDefault()
            }

            function setupItem(element) {

                setupIgnorerElements(element);
                /*
                const dragElement = config.draggableSelector ? element.querySelector(config.draggableSelector) : element;
                dragElement.draggable = true;
                dragElement.addEventListener('dragstart', handleDragStart);
                */
                element.draggable = true;
                element.addEventListener('dragstart', handleDragStart);
            }

            function destroyItem(element) {

                destroyIgnorerElements(element);

                /*
                const dragElement = config.draggableSelector ? element.querySelector(config.draggableSelector) : element;
                dragElement.removeEventListener('dragstart', handleDragStart);
                */
                element.removeEventListener('dragstart', handleDragStart);
            }

            function setupIgnorerElements(element) {
                config.ignorerSelector.split(',').forEach(function (criteria) {
                    element.querySelectorAll(criteria.trim()).forEach(setupPreventEvent);
                });
            }
            function destroyIgnorerElements(element) {
                config.ignorerSelector.split(',').forEach(function (criteria) {
                    element.querySelectorAll(criteria.trim()).forEach(destroyPreventEvent);
                });
            }
            function setupPreventEvent(element) {
                element.addEventListener('dragstart', preventEvent);
            }
            function destroyPreventEvent(element) {
                element.removeEventListener('dragstart', preventEvent);
            }
            function preventEvent(event) {
                event.preventDefault();
                event.stopPropagation();
            }





            let currentContainerElement = containerEl;
            let currentContainerVM = vm;

            let rqaId = null;
            let currentItem = null;
            let currentElement = null;
            let currentDragElement = null;
            let currentDragRect = null;
            let dragX = 0;
            let dragY = 0;

            function handleDragStart(event) {

                event.stopPropagation();
                //event.dataTransfer.effectAllowed = "move";// copyMove when we enhance the drag with clipboard data.
                
                if(!scrollElement) {
                    scrollElement = getParentScrollElement(containerEl, true);
                }
                
                const element = event.target;//.closest(config.itemSelector);
                window.addEventListener('dragover', handleDragMove);
                window.addEventListener('dragend', handleDragEnd);
                
                currentElement = element;
                currentDragElement = config.draggableSelector ? currentElement.querySelector(config.draggableSelector) : currentElement;
                currentDragRect = currentDragElement.getBoundingClientRect();
                currentItem = vm.getItemOfElement(currentElement);
                
                if (config.dataTransferResolver) {
                    config.dataTransferResolver(event.dataTransfer, currentItem);
                } else {
                    event.dataTransfer.setData("text/plain", element.innerText);
                }

                if (config.onStart) {
                    config.onStart({item: currentItem, element: currentElement});
                }
                
                //if(!FireFox) {
                    const clientX = (event.touches ? event.touches[0] : event).clientX;
                    const clientY = (event.touches ? event.touches[1] : event).clientY;
                    const mouseOffsetX = clientX - currentDragRect.left; //x position within the element.
                    const mouseOffsetY = clientY - currentDragRect.top;  //y position within the element.
                    // temp test with using shadowRoot..
                    const elToSnapshot = currentDragElement.shadowRoot.querySelector("div > *:not(style)");
                    event.dataTransfer.setDragImage(elToSnapshot, mouseOffsetX, mouseOffsetY);
                //}

                // We must wait one frame before changing the look of the block.
                rqaId = requestAnimationFrame(() => {// It should be okay to use the same refId, as the move does not or is okay not to happen on first frame/drag-move.
                    rqaId = null;
                    currentElement.classList.add(config.placeholderClass);
                });
                

            }
            
            function handleDragEnd(event) {

                //event?.stopPropagation();

                window.removeEventListener('dragover', handleDragMove);
                window.removeEventListener('dragend', handleDragEnd);
                currentElement.classList.remove(config.placeholderClass);

                stopAutoScroll();
                removeAllowIndication();

                currentContainerVM.sync(currentElement, vm);

                if (config.onEnd) {
                    config.onEnd({item: currentItem, element: currentElement});
                }

                if(rqaId) {
                    cancelAnimationFrame(rqaId);
                }

                currentContainerElement = containerEl;
                currentContainerVM = vm;

                rqaId = null
                currentItem = null;
                currentElement = null;
                currentDragElement = null;
                currentDragRect = null;
                dragX = 0;
                dragY = 0;
                
            }

            function handleDragMove(event) {

                if(!currentElement) {
                    return;
                }
                //event.stopPropagation();

                const clientX = (event.touches ? event.touches[0] : event).clientX;
                const clientY = (event.touches ? event.touches[1] : event).clientY;
                if(clientX !== 0 && clientY !== 0) {


                    if(dragX === clientX && dragY === clientY) {
                        return;
                    }
                    dragX = clientX;
                    dragY = clientY;

                    handleAutoScroll(dragX, dragY);
                    
                    currentDragRect = currentDragElement.getBoundingClientRect();
                    const insideCurrentRect = isWithinRect(dragX, dragY, currentDragRect, 0);
                    if (!insideCurrentRect) {
                        if(rqaId === null) {
                            rqaId = requestAnimationFrame(moveCurrentElement);
                        }
                    }
                }
            }

            

            function moveCurrentElement() {

                rqaId = null;
                if(!currentElement) {
                    return;
                }
                
                const currentElementRect = currentElement.getBoundingClientRect();
                const insideCurrentRect = isWithinRect(dragX, dragY, currentElementRect);
                if (insideCurrentRect) {
                    return;
                }

                // If we have a boundarySelector, try it, if we didn't get anything fall back to currentContainerElement.
                var currentBoundaryElement = (config.boundarySelector ? currentContainerElement.closest(config.boundarySelector) : currentContainerElement) || currentContainerElement;

                var currentBoundaryRect = currentBoundaryElement.getBoundingClientRect();
                
                const currentContainerHasItems = currentContainerVM.items.filter(x => x !== currentItem).length > 0;

                // if empty we will be move likely to accept an item (add 20px to the bounding box)
                // If we have items we must be 10 within the container to accept the move.
                const offsetEdge = currentContainerHasItems ? -10 : 20;
                if(!isWithinRect(dragX, dragY, currentBoundaryRect, offsetEdge)) {
                    // we are outside the current container boundary, so lets see if there is a parent we can move.
                    var parentContainer = currentContainerElement.parentNode.closest(config.containerSelector);
                    if(parentContainer) {
                        const parentContainerVM = parentContainer['umbBlockGridSorter:vm']();
                        if(parentContainerVM.identifier === vm.identifier) {
                            currentContainerElement = parentContainer;
                            currentContainerVM = parentContainerVM;
                        }
                    }
                }



               
                // We want to retrieve the children of the container, every time to ensure we got the right order and index
                const orderedContainerElements = Array.from(currentContainerElement.children);

                var currentContainerRect = currentContainerElement.getBoundingClientRect();
                

                // gather elements on the same row.
                let elementsInSameRow = [];
                let placeholderIsInThisRow = false;
                for (const el of orderedContainerElements) {
                    const elRect = el.getBoundingClientRect();
                    // gather elements on the same row.
                    if(dragY >= elRect.top && dragY <= elRect.bottom) {
                        const dragElement = config.draggableSelector ? el.querySelector(config.draggableSelector) : el;
                        const dragElementRect = dragElement.getBoundingClientRect();
                        elementsInSameRow.push({el:el, elRect:elRect, dragRect:dragElementRect});
                        if(el !== currentElement) {
                            placeholderIsInThisRow = true;
                        }
                    }
                }

                let lastDistance = 99999;
                let foundEl = null;
                let foundElRect = null;
                let foundElDragRect = null;
                let placeAfter = false;
                elementsInSameRow.forEach( sameRow => {
                    const centerX = (sameRow.dragRect.left + (sameRow.dragRect.width*.5));
                    let distance = Math.abs(dragX - centerX);
                    if(distance < lastDistance) {
                        foundEl = sameRow.el;
                        foundElRect = sameRow.elRect;
                        foundElDragRect = sameRow.dragRect;
                        lastDistance = Math.abs(distance);
                        placeAfter = dragX > centerX;
                    }
                });

                // If we are on top or closest to our self, we should not do anything.
                if (foundEl === currentElement) {
                    return;
                }

                if (foundEl) {

                    //let newIndex = containerElements.indexOf(foundRelatedEl);
                    //let foundItem = vm.items.find(entry => config.compareElementToModel(foundEl, entry));

                    const isInsideFound = isWithinRect(dragX, dragY, foundElDragRect, 0);
                    
                    // If we are inside the found element, lets look for sub containers.
                    // use the itemHasNestedContainersResolver, if not configured fallback to looking for the existence of a container via DOM.
                    if (isInsideFound && 
                        config.itemHasNestedContainersResolver ? config.itemHasNestedContainersResolver(foundEl) : foundEl.querySelector(config.containerSelector)) {
                        
                        // Find all sub containers:
                        const subLayouts = foundEl.querySelectorAll(config.containerSelector);
                        for (const subLayoutEl of subLayouts) {

                            // Use boundary element or fallback to container element.
                            var subBoundaryElement = (config.boundarySelector ? subLayoutEl.closest(config.boundarySelector) : subLayoutEl) || subLayoutEl;
                            var subBoundaryRect = subBoundaryElement.getBoundingClientRect();

                            const subContainerHasItems = subLayoutEl.querySelector(config.itemSelector+':not(.'+config.placeholderClass+')');
                            // gather elements on the same row.
                            const subOffsetEdge = subContainerHasItems ? -10 : 20;
                            if(isWithinRect(dragX, dragY, subBoundaryRect, subOffsetEdge)) {
                                
                                var subVm = subLayoutEl['umbBlockGridSorter:vm']();
                                if(subVm.identifier === vm.identifier) {
                                    currentContainerElement = subLayoutEl;
                                    currentContainerVM = subVm;
                                    moveCurrentElement();
                                    return;
                                }
                            }
                        }
                    }
                    
                    
                    // Indication if drop is good:
                    if(updateAllowIndication(currentContainerVM, currentItem) === false) {
                        return;
                    }
                    

                    let verticalDirection = scope.config.resolveVerticalDirection ? scope.config.resolveVerticalDirection({
                        containerElement: currentContainerElement,
                        containerRect: currentContainerRect,
                        item: currentItem,
                        element: currentElement,
                        elementRect: currentElementRect,
                        relatedElement: foundEl,
                        relatedRect: foundElDragRect,
                        placeholderIsInThisRow: placeholderIsInThisRow
                    }) : true;
                    
                    if (verticalDirection) {
                        placeAfter = (dragY > foundElDragRect.top + (foundElDragRect.height*.5));
                    }

                    const foundElIndex = orderedContainerElements.indexOf(foundEl);
                    const placeAt = (placeAfter ? foundElIndex+1 : foundElIndex);

                    move(orderedContainerElements, placeAt);

                    return;
                }
                // We skipped the above part cause we are above or below container:

                // Indication if drop is good:
                if(updateAllowIndication(currentContainerVM, currentItem) === false) {
                    return;
                }
                
                if(dragY < currentContainerRect.top) {
                    move(orderedContainerElements, 0);
                } else if(dragY > currentContainerRect.bottom) {
                    move(orderedContainerElements, -1);
                }
            }

            function move(orderedContainerElements, newElIndex) {

                newElIndex = newElIndex === -1 ? orderedContainerElements.length : newElIndex;
                
                const placeBeforeElement = orderedContainerElements[newElIndex];
                if (placeBeforeElement) {
                    // We do not need to move this, if the element to be placed before is it self.
                    if(placeBeforeElement !== currentElement) {
                        currentContainerElement.insertBefore(currentElement, placeBeforeElement);
                    }
                } else {
                    currentContainerElement.appendChild(currentElement);
                }

                if(config.onChange) {
                    config.onChange();
                }
            }


            /** Removes an element from container and returns its items-data entry */
            vm.getItemOfElement = function (element) {
                if(!element) {
                    return null;
                }
                return vm.items.find(entry => config.compareElementToModel(element, entry));
            }
            vm.removeItem = function (item) {
                if(!item) {
                    return null;
                }
                const oldIndex = vm.items.indexOf(item);
                if(oldIndex !== -1) {
                    return vm.items.splice(oldIndex, 1)[0];
                }
                return null;
            }

            vm.sync = function(element, fromVm) {

                const movingItem = fromVm.getItemOfElement(element);
                if(!movingItem) {
                    return;
                }
                if(vm.notifyRequestDrop({item: movingItem}) === false) {
                    return;
                }
                if(!fromVm.removeItem(movingItem)) {
                    return;
                }

                /** Find next element, to then find the index of that element in items-data, to use as a safe reference to where the item will go in our items-data.
                 * This enables the container to contain various other elements and as well having these elements change while sorting is occurring.
                 */

                // find next valid element (This assumes the next element in DOM is presented in items-data, aka. only moving one item between each sync)
                let nextEl;
                let loopEl = element;
                while(loopEl = loopEl.nextElementSibling) {
                    if(loopEl.matches && loopEl.matches(config.itemSelector)) {
                        nextEl = loopEl;
                        break;
                    }
                }

                let newIndex = vm.items.length;
                if(nextEl) {
                    // We had a reference element, we want to get the index of it.
                    // This is problem if a item is being moved forward?
                    newIndex = vm.items.findIndex(entry => config.compareElementToModel(nextEl, entry));
                }

                if(vm.items.indexOf(movingItem) === newIndex) {
                    console.error("WE DID NOT DO ANYTHING CAUSE YOU WHERE ALREADY HERE.")
                    return;
                }
                vm.items.splice(newIndex, 0, movingItem);

                const eventData = {item: movingItem, fromController:fromVm, toController:vm};
                if(fromVm !== vm) {
                    fromVm.notifySync(eventData);
                }
                vm.notifySync(eventData);
            }

            





            var _lastIndicationContainerVM = null;
            function updateAllowIndication(contextVM, item) {

                // Remove old indication:
                if(_lastIndicationContainerVM !== null && _lastIndicationContainerVM !== contextVM) {
                    _lastIndicationContainerVM.notifyAllowed();
                }
                _lastIndicationContainerVM = contextVM;
                
                if(contextVM.notifyRequestDrop({item: item}) === true) {
                    contextVM.notifyAllowed();
                    return true;
                }

                contextVM.notifyDisallowed();// This block is not accepted to we will indicate that its not allowed.
                return false;
            }
            function removeAllowIndication() {

                // Remove old indication:
                if(_lastIndicationContainerVM !== null) {
                    _lastIndicationContainerVM.notifyAllowed();
                }
                _lastIndicationContainerVM = null;
            }





            let autoScrollRAF;
            let autoScrollEl;
            const autoScrollSensitivity = 50;
            const autoScrollSpeed = 16;
            let autoScrollX = 0;
            let autoScrollY = 0;

            function handleAutoScroll(clientX, clientY) {

                let scrollRect = null;
                if (scrollElement) {
                    autoScrollEl = scrollElement;
                    scrollRect = scrollElement.getBoundingClientRect();
                } else {
                    autoScrollEl = document.scrollingElement || document.documentElement;
                    scrollRect = {top: 0,
                        left: 0,
                        bottom: window.innerHeight,
                        right: window.innerWidth,
                        height: window.innerHeight,
                        width: window.innerWidth
                    }
                }

                const scrollWidth = autoScrollEl.scrollWidth;
                const scrollHeight = autoScrollEl.scrollHeight;
                const canScrollX = scrollRect.width < scrollWidth;
                const canScrollY = scrollRect.height < scrollHeight;
                const scrollPosX = autoScrollEl.scrollLeft;
                const scrollPosY = autoScrollEl.scrollTop;

                cancelAnimationFrame(autoScrollRAF);

                if(canScrollX || canScrollY) {

                    autoScrollX = (Math.abs(scrollRect.right - clientX) <= autoScrollSensitivity && scrollPosX + scrollRect.width < scrollWidth) - (Math.abs(scrollRect.left - clientX) <= autoScrollSensitivity && !!scrollPosX);
                    autoScrollY = (Math.abs(scrollRect.bottom - clientY) <= autoScrollSensitivity && scrollPosY + scrollRect.height < scrollHeight) - (Math.abs(scrollRect.top - clientY) <= autoScrollSensitivity && !!scrollPosY);
                    autoScrollRAF = requestAnimationFrame(performAutoScroll);
                }
            }
            function performAutoScroll() {
                autoScrollEl.scrollLeft += autoScrollX * autoScrollSpeed;
                autoScrollEl.scrollTop += autoScrollY * autoScrollSpeed;
                autoScrollRAF = requestAnimationFrame(performAutoScroll);
            }
            function stopAutoScroll() {
                cancelAnimationFrame(autoScrollRAF);
                autoScrollRAF = null;
            }




            vm.notifySync = function(data) {
                if(config.onSync) {
                    config.onSync(data);
                }
            }
            vm.notifyDisallowed = function() {
                if(config.onDisallowed) {
                    config.onDisallowed();
                }
            }
            vm.notifyAllowed = function() {
                if(config.onAllowed) {
                    config.onAllowed();
                }
            }
            vm.notifyRequestDrop = function(data) {
                if(config.onRequestDrop) {
                    return config.onRequestDrop(data);
                }
                return true;
            }



            scope.$on('$destroy', () => {

                if(currentElement) {
                    handleDragEnd()
                }

                _lastIndicationContainerVM = null;

                containerEl['umbBlockGridSorter:vm'] = null
                containerEl.removeEventListener('dragover', preventDragOver);

                // Destroy!
                // Considering story all elements, and run through to clean up.

                observer.disconnect();
                observer = null;
                containerEl = null;
                scrollElement = null;
                vm = null;
            });
        }

        var directive = {
            restrict: 'A',
            scope: {
                config: '=umbBlockGridSorter'
            },
            link: link
        };

        return directive;

    }

    angular.module('umbraco.directives').directive('umbBlockGridSorter', UmbBlockGridSorter);

})();