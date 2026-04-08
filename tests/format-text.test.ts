/**
 * nasne 特殊文字変換機能のテスト
 * nasne が返す Private Use Area の Unicode 文字を日本語表記に変換する
 */
import { describe, it, expect } from "vitest";
import { formatText } from "../src/format-text.js";

describe("formatText", () => {
  describe("特殊文字の変換", () => {
    it("\\uE195 を [終] に変換する", () => {
      expect(formatText("\uE195番組タイトル")).toBe("[終]番組タイトル");
    });

    it("\\uE193 を [新] に変換する", () => {
      expect(formatText("\uE193番組タイトル")).toBe("[新]番組タイトル");
    });

    it("\\uE0FE を [字] に変換する", () => {
      expect(formatText("\uE0FE番組タイトル")).toBe("[字]番組タイトル");
    });

    it("\\uE184 を [解] に変換する", () => {
      expect(formatText("\uE184番組タイトル")).toBe("[解]番組タイトル");
    });

    it("\\uE183 を [多] に変換する", () => {
      expect(formatText("\uE183番組タイトル")).toBe("[多]番組タイトル");
    });

    it("\\uE180 を [デ] に変換する", () => {
      expect(formatText("\uE180番組タイトル")).toBe("[デ]番組タイトル");
    });
  });

  describe("複数の特殊文字が含まれる場合", () => {
    it("複数の特殊文字をすべて変換する", () => {
      expect(formatText("\uE195\uE193ドラマタイトル")).toBe("[終][新]ドラマタイトル");
    });

    it("同一の特殊文字が複数回出現する場合もすべて変換する", () => {
      expect(formatText("\uE195タイトル\uE195")).toBe("[終]タイトル[終]");
    });
  });

  describe("変換対象外の文字列", () => {
    it("特殊文字を含まない文字列はそのまま返す", () => {
      expect(formatText("通常のテキスト")).toBe("通常のテキスト");
    });

    it("空文字列はそのまま返す", () => {
      expect(formatText("")).toBe("");
    });

    it("JSON 形式の文字列も正しく変換する", () => {
      const input = JSON.stringify({ title: "\uE195ドラマ" });
      expect(formatText(input)).toContain("[終]ドラマ");
    });
  });
});
