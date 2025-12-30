/**
 * Component Builder Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  text,
  image,
  icon,
  video,
  audioPlayer,
  row,
  column,
  list,
  card,
  tabs,
  divider,
  modal,
  button,
  checkbox,
  textField,
  dateTimeInput,
  choicePicker,
  slider,
  textButton,
  h1,
  h2,
  h3,
  h4,
  h5,
  caption,
  body,
} from '../src/builders/component-builder';
import { resetIdCounter } from '../src/builders/id-generator';

describe('Component Builder', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe('text', () => {
    it('should create text component with string content', () => {
      const comp = text('Hello World', { id: 'my-text' });
      expect(comp).toEqual({
        id: 'my-text',
        component: 'Text',
        text: 'Hello World',
      });
    });

    it('should create text component with path binding', () => {
      const comp = text({ path: '/user/name' }, { id: 'bound-text' });
      expect(comp).toEqual({
        id: 'bound-text',
        component: 'Text',
        text: { path: '/user/name' },
      });
    });

    it('should include usageHint when specified', () => {
      const comp = text('Title', { id: 'title', usageHint: 'h1' });
      expect(comp.usageHint).toBe('h1');
    });

    it('should auto-generate id if not provided', () => {
      const comp = text('Auto ID');
      expect(comp.id).toMatch(/^text_\d+_\d+$/);
    });
  });

  describe('image', () => {
    it('should create image component', () => {
      const comp = image('https://example.com/image.png', {
        id: 'my-image',
        fit: 'cover',
        usageHint: 'avatar',
      });
      expect(comp).toEqual({
        id: 'my-image',
        component: 'Image',
        url: 'https://example.com/image.png',
        fit: 'cover',
        usageHint: 'avatar',
      });
    });
  });

  describe('icon', () => {
    it('should create icon component', () => {
      const comp = icon('home', { id: 'home-icon' });
      expect(comp).toEqual({
        id: 'home-icon',
        component: 'Icon',
        name: 'home',
      });
    });
  });

  describe('row', () => {
    it('should create row with static children', () => {
      const comp = row(['child1', 'child2'], { id: 'my-row' });
      expect(comp).toEqual({
        id: 'my-row',
        component: 'Row',
        children: ['child1', 'child2'],
      });
    });

    it('should create row with dynamic template', () => {
      const comp = row({ componentId: 'template', path: '/items' }, { id: 'dynamic-row' });
      expect(comp).toEqual({
        id: 'dynamic-row',
        component: 'Row',
        children: { componentId: 'template', path: '/items' },
      });
    });

    it('should include layout options', () => {
      const comp = row(['child1'], {
        id: 'styled-row',
        alignment: 'center',
        distribution: 'spaceBetween',
      });
      expect(comp.alignment).toBe('center');
      expect(comp.distribution).toBe('spaceBetween');
    });
  });

  describe('column', () => {
    it('should create column with children', () => {
      const comp = column(['child1', 'child2', 'child3'], { id: 'my-column' });
      expect(comp).toEqual({
        id: 'my-column',
        component: 'Column',
        children: ['child1', 'child2', 'child3'],
      });
    });
  });

  describe('card', () => {
    it('should create card with child', () => {
      const comp = card('content', { id: 'my-card' });
      expect(comp).toEqual({
        id: 'my-card',
        component: 'Card',
        child: 'content',
      });
    });
  });

  describe('button', () => {
    it('should create button with action', () => {
      const comp = button('btn-text', { name: 'submit' }, { id: 'my-button', primary: true });
      expect(comp).toEqual({
        id: 'my-button',
        component: 'Button',
        child: 'btn-text',
        action: { name: 'submit' },
        primary: true,
      });
    });

    it('should include action context', () => {
      const comp = button(
        'btn-text',
        {
          name: 'select',
          context: {
            itemId: { path: '/item/id' },
            name: 'test',
          },
        },
        { id: 'ctx-button' }
      );
      expect(comp.action).toEqual({
        name: 'select',
        context: {
          itemId: { path: '/item/id' },
          name: 'test',
        },
      });
    });
  });

  describe('textField', () => {
    it('should create text field', () => {
      const comp = textField('Email', { path: '/form/email' }, {
        id: 'email-field',
        usageHint: 'shortText',
      });
      expect(comp).toEqual({
        id: 'email-field',
        component: 'TextField',
        label: 'Email',
        text: { path: '/form/email' },
        usageHint: 'shortText',
      });
    });
  });

  describe('textButton', () => {
    it('should return text and button components', () => {
      const [textComp, buttonComp] = textButton('Click Me', { name: 'click' });
      
      expect(textComp.component).toBe('Text');
      expect(textComp.text).toBe('Click Me');
      
      expect(buttonComp.component).toBe('Button');
      expect(buttonComp.child).toBe(textComp.id);
      expect(buttonComp.action).toEqual({ name: 'click' });
    });
  });

  describe('heading helpers', () => {
    it('should create h1', () => {
      const comp = h1('Title', { id: 'title' });
      expect(comp.usageHint).toBe('h1');
    });

    it('should create h2', () => {
      const comp = h2('Subtitle', { id: 'subtitle' });
      expect(comp.usageHint).toBe('h2');
    });
  });

  describe('weight', () => {
    it('should include weight when specified', () => {
      const comp = text('Weighted', { id: 'weighted', weight: 2 });
      expect(comp.weight).toBe(2);
    });
  });

  describe('video', () => {
    it('should create video component', () => {
      const comp = video('https://example.com/video.mp4', { id: 'my-video' });
      expect(comp).toEqual({
        id: 'my-video',
        component: 'Video',
        url: 'https://example.com/video.mp4',
      });
    });
  });

  describe('audioPlayer', () => {
    it('should create audio player component', () => {
      const comp = audioPlayer('https://example.com/audio.mp3', {
        id: 'my-audio',
        description: 'My Song',
      });
      expect(comp).toEqual({
        id: 'my-audio',
        component: 'AudioPlayer',
        url: 'https://example.com/audio.mp3',
        description: 'My Song',
      });
    });
  });

  describe('list', () => {
    it('should create list component', () => {
      const comp = list(['item1', 'item2'], {
        id: 'my-list',
        direction: 'vertical',
        alignment: 'start',
      });
      expect(comp).toEqual({
        id: 'my-list',
        component: 'List',
        children: ['item1', 'item2'],
        direction: 'vertical',
        alignment: 'start',
      });
    });
  });

  describe('tabs', () => {
    it('should create tabs component', () => {
      const comp = tabs(
        [
          { title: 'Tab 1', childId: 'content1' },
          { title: 'Tab 2', childId: 'content2' },
        ],
        { id: 'my-tabs' }
      );
      expect(comp).toEqual({
        id: 'my-tabs',
        component: 'Tabs',
        tabItems: [
          { title: 'Tab 1', child: 'content1' },
          { title: 'Tab 2', child: 'content2' },
        ],
      });
    });
  });

  describe('divider', () => {
    it('should create divider component', () => {
      const comp = divider({ id: 'my-divider', axis: 'horizontal' });
      expect(comp).toEqual({
        id: 'my-divider',
        component: 'Divider',
        axis: 'horizontal',
      });
    });
  });

  describe('modal', () => {
    it('should create modal component', () => {
      const comp = modal('trigger-btn', 'modal-content', { id: 'my-modal' });
      expect(comp).toEqual({
        id: 'my-modal',
        component: 'Modal',
        entryPointChild: 'trigger-btn',
        contentChild: 'modal-content',
      });
    });
  });

  describe('checkbox', () => {
    it('should create checkbox component', () => {
      const comp = checkbox('Accept terms', true, { id: 'my-checkbox' });
      expect(comp).toEqual({
        id: 'my-checkbox',
        component: 'CheckBox',
        label: 'Accept terms',
        value: true,
      });
    });

    it('should support path binding for value', () => {
      const comp = checkbox('Accept', { path: '/form/accepted' }, { id: 'cb' });
      expect(comp.value).toEqual({ path: '/form/accepted' });
    });
  });

  describe('dateTimeInput', () => {
    it('should create date time input component', () => {
      const comp = dateTimeInput('2024-01-01', {
        id: 'my-datetime',
        enableDate: true,
        enableTime: false,
        label: 'Select date',
      });
      expect(comp).toEqual({
        id: 'my-datetime',
        component: 'DateTimeInput',
        value: '2024-01-01',
        enableDate: true,
        enableTime: false,
        label: 'Select date',
      });
    });
  });

  describe('choicePicker', () => {
    it('should create choice picker component', () => {
      const comp = choicePicker(
        [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
        ],
        ['a'],
        'mutuallyExclusive',
        { id: 'my-choice', label: 'Pick one' }
      );
      expect(comp).toEqual({
        id: 'my-choice',
        component: 'ChoicePicker',
        options: [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
        ],
        value: ['a'],
        usageHint: 'mutuallyExclusive',
        label: 'Pick one',
      });
    });
  });

  describe('slider', () => {
    it('should create slider component', () => {
      const comp = slider(50, {
        id: 'my-slider',
        min: 0,
        max: 100,
        label: 'Volume',
      });
      expect(comp).toEqual({
        id: 'my-slider',
        component: 'Slider',
        value: 50,
        min: 0,
        max: 100,
        label: 'Volume',
      });
    });
  });

  describe('more heading helpers', () => {
    it('should create h3', () => {
      const comp = h3('H3 Title', { id: 'h3' });
      expect(comp.usageHint).toBe('h3');
    });

    it('should create h4', () => {
      const comp = h4('H4 Title', { id: 'h4' });
      expect(comp.usageHint).toBe('h4');
    });

    it('should create h5', () => {
      const comp = h5('H5 Title', { id: 'h5' });
      expect(comp.usageHint).toBe('h5');
    });

    it('should create caption', () => {
      const comp = caption('Caption text', { id: 'cap' });
      expect(comp.usageHint).toBe('caption');
    });

    it('should create body', () => {
      const comp = body('Body text', { id: 'body' });
      expect(comp.usageHint).toBe('body');
    });
  });
});

