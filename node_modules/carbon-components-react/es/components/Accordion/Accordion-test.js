/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Accordion from '../Accordion';
import AccordionSkeleton from '../Accordion/Accordion.Skeleton';
import SkeletonText from '../SkeletonText';
import { shallow, mount } from 'enzyme';
describe('Accordion', function () {
  describe('Renders as expected', function () {
    var wrapper = shallow(React.createElement(Accordion, {
      className: "extra-class"
    }, React.createElement("div", {
      className: "child"
    }, "Test")));
    it('renders children as expected', function () {
      expect(wrapper.find('.child').length).toBe(1);
    });
    it('has the expected classes', function () {
      expect(wrapper.hasClass('bx--accordion')).toEqual(true);
    });
    it('renders extra classes passed in via className', function () {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
});
describe('AccordionSkeleton', function () {
  describe('Renders as expected', function () {
    var wrapper = shallow(React.createElement(AccordionSkeleton, null));
    it('Has the expected classes', function () {
      expect(wrapper.hasClass('bx--skeleton')).toEqual(true);
      expect(wrapper.hasClass('bx--accordion')).toEqual(true);
    });
    it('Renders first item as expected', function () {
      expect(wrapper.contains(React.createElement(SkeletonText, {
        width: "90%"
      }))).toEqual(true);
    });
    it('Renders without opened item', function () {
      var noOpenedItem = shallow(React.createElement(AccordionSkeleton, {
        open: false
      }));
      expect(noOpenedItem.contains(React.createElement(SkeletonText, {
        width: "90%"
      }))).toEqual(false);
    });
    it('Renders number of items as expected', function () {
      var fullWrapper = mount(React.createElement(AccordionSkeleton, null));
      expect(fullWrapper.find('.bx--accordion__item')).toHaveLength(4);
    });
    it('Renders custom number of items', function () {
      var fullWrapper = mount(React.createElement(AccordionSkeleton, {
        count: 8
      }));
      expect(fullWrapper.find('.bx--accordion__item')).toHaveLength(8);
    });
  });
});