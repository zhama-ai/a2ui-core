/**
 * Format Compatibility Test
 *
 * 验证构建器输出与官方 A2UI v0.9 规范格式一致性
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
  createSurface,
  updateComponents,
  updateDataModel,
  deleteSurface,
  resetIdCounter,
  eventAction,
} from '../src/builders/index';

describe('v0.9 Format Compatibility', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe('Component Format', () => {
    it('should output flat component format (not nested)', () => {
      const comp = text('Hello', { id: 'test' });

      // v0.9 格式：属性在顶层
      expect(comp.id).toBe('test');
      expect(comp.component).toBe('Text');
      expect(comp.text).toBe('Hello');

      // 不应该有嵌套的 component 对象（v0.8 格式）
      expect(typeof comp.component).toBe('string');
    });

    it('should support all standard component types', () => {
      const components = [
        text('Hello', { id: 'text1' }),
        image('http://example.com/img.png', { id: 'image1' }),
        icon('check', { id: 'icon1' }),
        video('http://example.com/video.mp4', { id: 'video1' }),
        audioPlayer('http://example.com/audio.mp3', { id: 'audio1' }),
        row(['child1'], { id: 'row1' }),
        column(['child1'], { id: 'column1' }),
        list(['child1'], { id: 'list1' }),
        card('child', { id: 'card1' }),
        tabs([{ title: 'Tab1', childId: 'child1' }], { id: 'tabs1' }),
        divider({ id: 'divider1' }),
        modal('entry', 'content', { id: 'modal1' }),
        button('label', eventAction('action'), { id: 'button1' }),
        checkbox('Label', { path: '/checked' }, { id: 'checkbox1' }),
        textField('Label', undefined, { id: 'textfield1' }),
        dateTimeInput({ path: '/date' }, { id: 'datetime1' }),
        choicePicker([{ label: 'Option', value: 'opt' }], { path: '/selected' }, { id: 'choice1' }),
        slider({ path: '/value' }, 0, 100, { id: 'slider1' }),
      ];

      const expectedTypes = [
        'Text',
        'Image',
        'Icon',
        'Video',
        'AudioPlayer',
        'Row',
        'Column',
        'List',
        'Card',
        'Tabs',
        'Divider',
        'Modal',
        'Button',
        'CheckBox',
        'TextField',
        'DateTimeInput',
        'ChoicePicker',
        'Slider',
      ];

      components.forEach((comp, index) => {
        expect(comp.component).toBe(expectedTypes[index]);
        expect(typeof comp.id).toBe('string');
      });
    });
  });

  describe('Data Binding Format', () => {
    it('should support string literal for text', () => {
      const comp = text('Hello World');
      expect(comp.text).toBe('Hello World');
    });

    it('should support path object for data binding', () => {
      const comp = text({ path: '/user/name' });
      expect(comp.text).toEqual({ path: '/user/name' });
    });

    it('should support number literal for slider', () => {
      const comp = slider(50, 0, 100, { id: 'slider' });
      expect(comp.value).toBe(50);
    });

    it('should support boolean for checkbox', () => {
      const comp = checkbox('Label', true, { id: 'cb' });
      expect(comp.value).toBe(true);
    });
  });

  describe('Message Format', () => {
    it('should create valid createSurface message', () => {
      const msg = createSurface('my-surface', {
        catalogId: 'https://a2ui.dev/specification/v0_9/standard_catalog.json',
      });

      expect(msg).toHaveProperty('createSurface');
      expect(msg.createSurface.surfaceId).toBe('my-surface');
      expect(msg.createSurface.catalogId).toBe('https://a2ui.dev/specification/v0_9/standard_catalog.json');
    });

    it('should create createSurface message with theme', () => {
      const msg = createSurface('my-surface', {
        theme: { primaryColor: '#00BFFF' },
      });

      expect(msg.createSurface.theme).toEqual({ primaryColor: '#00BFFF' });
    });

    it('should create createSurface message with sendDataModel', () => {
      const msg = createSurface('my-surface', {
        sendDataModel: true,
      });

      expect(msg.createSurface.sendDataModel).toBe(true);
    });

    it('should create valid updateComponents message', () => {
      const components = [
        column(['title', 'button'], { id: 'root' }),
        text('Hello', { id: 'title' }),
        button('btn-text', eventAction('submit'), { id: 'button' }),
      ];

      const msg = updateComponents('my-surface', components);

      expect(msg).toHaveProperty('updateComponents');
      expect(msg.updateComponents.surfaceId).toBe('my-surface');
      expect(msg.updateComponents.components).toHaveLength(3);
      expect(msg.updateComponents.components[0].id).toBe('root');
    });

    it('should create valid updateDataModel message', () => {
      const msg = updateDataModel('my-surface', { user: { name: 'John' } });

      expect(msg).toHaveProperty('updateDataModel');
      expect(msg.updateDataModel.surfaceId).toBe('my-surface');
      expect(msg.updateDataModel.value).toEqual({ user: { name: 'John' } });
    });

    it('should create valid updateDataModel message with path', () => {
      const msg = updateDataModel('my-surface', 'Jane', '/user/name');

      expect(msg.updateDataModel.path).toBe('/user/name');
      expect(msg.updateDataModel.value).toBe('Jane');
    });

    it('should create valid deleteSurface message', () => {
      const msg = deleteSurface('my-surface');

      expect(msg).toHaveProperty('deleteSurface');
      expect(msg.deleteSurface.surfaceId).toBe('my-surface');
    });
  });

  describe('Children Property Format', () => {
    it('should support static children array', () => {
      const comp = column(['child1', 'child2', 'child3'], { id: 'col' });
      expect(comp.children).toEqual(['child1', 'child2', 'child3']);
    });

    it('should support template children for dynamic lists', () => {
      const comp = column({ componentId: 'itemTemplate', path: '/items' }, { id: 'col' });
      expect(comp.children).toEqual({ componentId: 'itemTemplate', path: '/items' });
    });
  });

  describe('Action Format', () => {
    it('should create action with event wrapper', () => {
      const comp = button('Submit', eventAction('submitForm'), { id: 'btn' });
      expect(comp.action).toEqual({ event: { name: 'submitForm' } });
    });

    it('should create action with context', () => {
      const comp = button(
        'Submit',
        eventAction('submitForm', {
          userId: '123',
          email: { path: '/form/email' },
        }),
        { id: 'btn' }
      );

      expect(comp.action).toEqual({
        event: {
          name: 'submitForm',
          context: {
            userId: '123',
            email: { path: '/form/email' },
          },
        },
      });
    });
  });

  describe('v0.9 Property Names', () => {
    it('should use variant instead of usageHint for Text', () => {
      const comp = text('Hello', { id: 'test', variant: 'h1' });
      expect(comp.variant).toBe('h1');
      expect(comp).not.toHaveProperty('usageHint');
    });

    it('should use variant instead of usageHint for Image', () => {
      const comp = image('http://example.com/img.png', { id: 'test', variant: 'avatar' });
      expect(comp.variant).toBe('avatar');
      expect(comp).not.toHaveProperty('usageHint');
    });

    it('should use align and justify instead of alignment and distribution', () => {
      const comp = row(['child1'], { id: 'test', align: 'center', justify: 'spaceBetween' });
      expect(comp.align).toBe('center');
      expect(comp.justify).toBe('spaceBetween');
      expect(comp).not.toHaveProperty('alignment');
      expect(comp).not.toHaveProperty('distribution');
    });

    it('should use tabs instead of tabItems', () => {
      const comp = tabs([{ title: 'Tab 1', childId: 'content1' }], { id: 'test' });
      expect(comp.tabs).toBeDefined();
      expect(comp).not.toHaveProperty('tabItems');
    });

    it('should use trigger and content instead of entryPointChild and contentChild', () => {
      const comp = modal('trigger', 'content', { id: 'test' });
      expect(comp.trigger).toBe('trigger');
      expect(comp.content).toBe('content');
      expect(comp).not.toHaveProperty('entryPointChild');
      expect(comp).not.toHaveProperty('contentChild');
    });

    it('should use value instead of text for TextField', () => {
      const comp = textField('Label', 'initial value', { id: 'test' });
      expect(comp.value).toBe('initial value');
      expect(comp).not.toHaveProperty('text');
    });
  });
});
