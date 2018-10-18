module Builds
  class PromotedEvent < ApplicationEvent
    fields :source_build_uid, :build_uid, :target_stage_uid

    schema do
      required(:source_build_uid).filled(:str?)
      required(:build_uid).filled(:str?)
      required(:target_stage_uid).filled(:str?)
    end

  end
end
