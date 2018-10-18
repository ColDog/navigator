class ReleasesController < ApplicationController

  def build
    app = App.find_by_name!(params[:app])
    stage = Stage.find_by!(app: app, name: params[:stage])

    Builds::CreateCommand.execute(
      version:   params[:version],
      values:    params[:values],
      app_uid:   app.uid,
      stage_uid: stage.uid,
    )
    head :created
  end

  def release
    app = App.find_by!(name: params[:app])
    stage = Stage.find_by!(app: app, name: params[:stage])
    build = Build.find_by!(version: params[:version], app: app, stage: stage)

    Releases::CreateCommand.execute(build_uid: build.uid)
    head :created
  end

  def promote
    app = App.find_by!(name: params[:app])
    stage = Stage.find_by!(app: app, name: params[:stage])
    build = Build.find_by!(version: params[:version], app: app, stage: stage)
    target = Stage.find_by!(app: app, name: params[:to])

    Builds::PromoteCommand.execute(
      source_build_uid: build.uid,
      target_stage_uid: target.uid,
    )
    head :created
  end

  def remove
    app = App.find_by!(name: params[:app])
    stage = Stage.find_by!(app: app, name: params[:stage])
    release = stage.released.try(:release)

    if release
      Releases::DeleteCommand.execute(target_release_uid: release.uid)
    end
    head :created
  end

end
